import mingus.core.intervals as intervals
import mingus.core.chords as chords
import mingus.core.scales as scales
import mingus.core.notes as notes
from mingus.containers import Note
import pretty_midi as pm
from midi2audio import FluidSynth
from pydub import AudioSegment
import tempfile
import random
import copy, math

Soundfonts = ['api/static/soundfonts/NY_Steinway_Model_D.sf2']
SOUNDFONT = Soundfonts[0]

#Functions for creating a new song
def create_new_song(key, quality, length, additions):
    song_list = []
    song = {}
    chords_out = {}
    ordered_chord_list = []

    #Create list of usable chords
    if quality == 'Major':
        notes_list = scales.Major(key)
        notes_list = notes_list.ascending()
        notes_list.pop(-1)
        notes_list.pop(-1)
        chord_list = [chords.triad(x, key) for x in notes_list]
    else:
        notes_list = scales.NaturalMinor(key)
        notes_list = notes_list.ascending()
        notes_list.pop(-1)
        notes_list.pop(1)
        chord_list = [chords.triad(x, intervals.from_shorthand(key, 'b3')) for x in notes_list]

    chord_list = [[{'name': chords.determine(c, True, True, True), 'chord': c, 'root': c[0], 'addition': chords.determine(c, True, True, True)[0][len(c[0]):]}] for c in chord_list]
    
    def add_addition(addition, chord_nrs, addition_name=None):
        if not addition_name:
            addition_name = addition
        for i in chord_nrs:
            object = copy.deepcopy(chord_list[i][0])
            object['name'][0] += addition_name
            object['chord'] = chords.from_shorthand(object['root'] + addition)
            object['addition'] += addition_name
            chord_list[i].append(object)

    if additions:
        for addition in additions:
            if additions[addition]:
                if addition == 'M7':
                    add_addition('M7', [0, 3], 'Maj7')
                if addition == '7':
                    add_addition('7', [4])
                if addition == 'm7':
                    add_addition('m7', [1, 2, 5], '7')
                if addition == 'm6':
                    add_addition('m6', [1], '6')
                if addition == '6':
                    add_addition('6', [0, 3, 4], '6')
                if addition == 'M9':
                    add_addition('M9', [0, 3], 'add9')
                if addition == 'sus2':
                    add_addition('sus2', [0, 3, 4])
                if addition == 'sus4':
                    add_addition('sus4', [0, 3, 4])


    #Create chords object to send as json
    for c_list in chord_list:
        for c in c_list:
            chord_numbers = [int(Note(note, 5)) for note in c['chord']]
            for index, number in enumerate(chord_numbers):
                former_index = index - 1
                if number < chord_numbers[0] or (former_index >= 0 and number < chord_numbers[former_index]) or (number <= 59):
                    chord_numbers[index] += 12
                
                    
            chords_out[c['name'][0]] = chord_numbers
    


    #Create and append random chords to song list based on length
    for n in range(length):
        place = 0
        if 0 < n < length - 1:
            place += 1
        elif 0 < n == length - 1:
            place += 2

        numbers = generate_numbers(place, quality)
        temp_chords = []
        
        for n in numbers:
            temp_chords.append(random.choice(chord_list[n]))
        song_list.append(temp_chords)

    #Create verses and add to song object
    for verse_index, verse in enumerate(song_list):
        new_verse = {}
        for chord_index, chord in enumerate(verse):
            new_verse[chord_index] = chord
            ordered_chord_list.append(chord['name'][0])
        song[verse_index] = new_verse
    
    #Final ajustment to chord objects list
    chord_obj_list = [x[0] for x in chord_list]

    return song, chords_out, ordered_chord_list, chord_obj_list

def generate_numbers(place, quality):
    #For place: 0=Beginning verse, 1=Middle verse, 2=Ending verse
    list = [0, 1, 2, 3, 4, 5]
    numbers = []
    if not place:
        numbers.append(0)
        for _ in range(3):
            temp_list = list.copy()
            temp_list.remove(numbers[-1])
            numbers.append(random.choice(temp_list))
    elif place == 1:
        for n in range(4):
            temp_list = list.copy()
            if n in [1, 3]:
                temp_list.remove(numbers[-1])
            numbers.append(random.choice(temp_list))
    else:
        for n in range(3):
            temp_list = list.copy()
            if n == 1:
                temp_list.remove(numbers[-1])
            elif n == 2:
                temp_list.remove(numbers[0])
            numbers.append(random.choice(temp_list))
        numbers.append(0)
    
    return numbers


#Functions for generating audio
def generate_audio(song, chords, variation, base, tempo=4):
    song_list = []
    song_numbers = []

    print(base)
    print(song)


    for verse in song.values():
        verse_numbers = []
        for chord in verse.values():
            chord_name = chord['name'][0]
            song_list.append(chord_name)
            verse_numbers.append(chords[chord_name])
        song_numbers.append(verse_numbers)
    
    print(song_numbers)

    midi = generate_midi(song_numbers, variation, base, tempo=tempo)

    audio_bytes = midi_to_mp3(midi, SOUNDFONT)

    return audio_bytes, song_list

def generate_midi(song, variation, base, tempo):
    midi = pm.PrettyMIDI()
    instrument = pm.Instrument(program=0)
    instrument_base = pm.Instrument(program=0)

    #Create chords
    if variation == 0:
        chord_length = tempo
        verse_length = chord_length * 4

        #Iterate over song
        for verse_index, verse in enumerate(song):
            verse_start = verse_index * verse_length
            verse_end = (verse_index + 1) * verse_length

            for chord_index, chord in enumerate(verse):
                chord_start = chord_index * chord_length
                chord_end = (chord_index + 1) * chord_length

                #Add notes
                for i in range(2):
                    for note_index, note in enumerate(chord):
                        note_length = chord_length / 2
                        note_start = verse_start + chord_start + (note_length * i)
                        note_end = note_start + note_length - 0.1
                        note = pm.Note(velocity=100, pitch=note, start=note_start, end=note_end)
                        instrument.notes.append(note)
                
                #Add sustain
                if verse_index + chord_index == 0:
                    sustain_start = 0.0
                else:
                    sustain_start = chord_start + verse_start + 0.1
                sustain_stop = chord_end + verse_start + 0.08    
                
                sustain = pm.ControlChange(number=64, value=127, time=sustain_start)
                instrument.control_changes.append(sustain)
                instrument_base.control_changes.append(sustain)
                sustain = pm.ControlChange(number=64, value=0, time=sustain_stop)
                instrument.control_changes.append(sustain)
                instrument_base.control_changes.append(sustain)
              

    #Create arpeggiated chords (version 1)
    if variation == 1:
        chord_length = tempo
        verse_length = chord_length * 4

        #Call function to create new list of notes
        new_song = new_progression(song, 1)

        #Iterate over song
        for verse_index, verse in enumerate(new_song):
            verse_start = verse_index * verse_length
            verse_end = (verse_index + 1) * verse_length

            for chord_index, chord in enumerate(verse):
                chord_start = chord_index * chord_length
                chord_end = (chord_index + 1) * chord_length

                #Add notes
                for note_index, note in enumerate(chord):
                    note_length = chord_length / 16
                    note_start = verse_start + chord_start + (note_length * note_index)
                    note_end = note_start + note_length
                    note = pm.Note(velocity=100, pitch=note, start=note_start, end=note_end)
                    
                    instrument.notes.append(note)

                #Add sustain
                if verse_index + chord_index == 0:
                    sustain_start = 0.0
                else:
                    sustain_start = chord_start + verse_start + 0.1
                sustain_stop = chord_end + verse_start + 0.08    
                
                sustain = pm.ControlChange(number=64, value=127, time=sustain_start)
                instrument.control_changes.append(sustain)
                instrument_base.control_changes.append(sustain)
                sustain = pm.ControlChange(number=64, value=0, time=sustain_stop)
                instrument.control_changes.append(sustain)
                instrument_base.control_changes.append(sustain)

    #Add base
    if base in [1, 2]:
        chord_length = tempo
        for verse_index, verse in enumerate(song):
            verse_start = verse_index * verse_length
            verse_end = (verse_index + 1) * verse_length

            for chord_index, chord in enumerate(verse):
                chord_start = chord_index * chord_length
                chord_end = (chord_index + 1) * chord_length
                note_start = chord_start + verse_start
                note_end = chord_end - 0.2
                pitch1 = chord[0] - 12
                note1 = pm.Note(velocity=100, pitch=pitch1, start=note_start, end=note_end)
                instrument.notes.append(note1)
                if base == 2:
                    pitch2 = chord[0] - 24
                    note2 = pm.Note(velocity=100, pitch=pitch2, start=note_start, end=note_end)
                    instrument.notes.append(note2)
    elif base == 3:
        new_song = new_base(song, 3)
        chord_length = tempo
        for verse_index, verse in enumerate(new_song):
            verse_start = verse_index * verse_length
            verse_end = (verse_index + 1) * verse_length

            for chord_index, chord in enumerate(verse):
                chord_start = chord_index * chord_length
                chord_end = (chord_index + 1) * chord_length

                #Add notes
                for note_index, note in enumerate(chord):
                    note_length = chord_length / 12
                    note_start = verse_start + chord_start + (note_length * note_index)
                    note_end = note_start + note_length
                    velocity = 80
                    if note_index == 0:
                        velocity = 100
                        note_end += chord_length - (note_length * 2)
                        
                    note = pm.Note(velocity=velocity, pitch=note, start=note_start, end=note_end)
                    
                    instrument_base.notes.append(note)
    
    midi.instruments.append(instrument_base)

    midi.instruments.append(instrument)

    return midi

def midi_to_mp3(midi, soundfont):
    with tempfile.NamedTemporaryFile(suffix=".midi", delete=False) as temp_midi_file:
        midi.write(temp_midi_file.name)

    fs = FluidSynth(soundfont)
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_wav_file:
        fs.midi_to_audio(temp_midi_file.name, temp_wav_file.name)
    
        with open(temp_wav_file.name, 'rb') as wav_file:
            wav_data = wav_file.read()

    audio_segment = AudioSegment(wav_data)
    mp3_bytes = audio_segment.export(format="mp3", bitrate="192k").read()

    return mp3_bytes

def new_progression(song, variation):
    new_song = []
    if variation == 1:
        for verse in song:
            new_verse = []
            for chord in verse:
                new_chord = chord.copy()
                new_chord.append(chord[1])
                new_chord = new_chord * 4
                new_verse.append(new_chord)
            new_song.append(new_verse)
    
    return new_song

def new_base(song, variation):
    new_base = []
    if variation == 3:
        for verse in song:
            new_verse = []
            for chord in verse:
                one = chord[0] - 12
                three = chord[1] - 12
                five = chord[2] - 12
                new_chord = [one - 12, one, three, five, three, five, one + 12, five, three, five, three, one]
                new_verse.append(new_chord)
            new_base.append(new_verse)
    
    return new_base


#Create interval session
def generate_interval_session(intervals_included, directions, width, length):
    interval_names = ['Minor second', 'Major second', 'Minor third', 'Major third', 'Perfect fourth', 'Tritone', 'Perfect fifth', 'Minor sixth', 'Major sixth', 'Minor seventh', 'Major seventh', 'Octave']
    direction_choices = ['Up', 'Down', 'Unison']
    if width == 0:
        starting_note = 60
        scope_length = 12
    elif width == 1: 
        starting_note = 48
        scope_length = 24
    elif width == 2:
        starting_note = scope_length = 36

    intervals = {}
    for n in range(length):
        interval_number = random.choice(intervals_included)
        root = random.randrange(starting_note, starting_note + scope_length)
        interval = []
        interval_obj = {}
        if 'Random' in directions:
            temp_directions = [random.choice(direction_choices)]
        else:
            temp_directions = directions[:]
        if 'Up' in temp_directions:
            interval.append([root])
            interval.append([root + interval_number])
        if 'Down' in temp_directions:
            interval.append([root])
            interval.append([root - interval_number])
        if 'Unison' in temp_directions:
            interval.append([root, root + interval_number])
        interval_obj['numbers'] = interval
        interval_obj['name'] = interval_names[interval_number - 1]
        intervals[n] = interval_obj
    
    session = {
        'intervals': intervals,
    }
    
    return session

def generate_interval_progress_session(progress, infoOnly=False):
    interval_names = ['Minor second', 'Major second', 'Minor third', 'Major third', 'Perfect fourth', 'Tritone', 'Perfect fifth', 'Minor sixth', 'Major sixth', 'Minor seventh', 'Major seventh', 'Octave']
    if 0 <= progress <= 9:
        directions = ['Up']
        width = 0
        length = 10
    if 10 <= progress <= 19:
        intervals_included = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        directions = ['Up']
        width = 1
        length = 10
    if 20 <= progress:
        intervals_included = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        directions = ['Random']
        width = 1
        length = 10
    if progress == 0:
        intervals_included = [5, 7, 12]
    if progress == 1:
        intervals_included = [2, 4, 12]
    if 2 <= progress <=3:
        intervals_included = [2, 4, 5, 7, 12]
    if progress == 3:
        width = 1
    if progress == 4:
        intervals_included = [9, 11]
    if 5 <= progress <= 6: 
        intervals_included = [2, 4, 5, 7, 9, 11, 12]
    if progress == 6:
        width = 2
        length = 20
    if progress == 7:
        intervals_included = [1, 3, 6, 8]
    if progress == 8:
        intervals_included = [10, 11]
    if progress == 9:
        intervals_included = [8, 9, 10, 11]
    if progress == 10:
        length = 20
    if progress == 11:
        directions.append('Down')
    if 12 <= progress <= 15:
        directions = ['Down']
    if progress == 12:
        intervals_included = [2, 4, 5, 7]
    if progress == 13:
        intervals_included = [2, 4, 5, 7, 9, 11, 12]
    if progress == 14:
        intervals_included = [1, 3, 8, 9, 10, 11]
    if progress == 15:
        length = 20
    if progress == 16:
        directions.append('Unison')
        length = 20
    if 17 <= progress <= 19:
        directions = ['Unison']
    if progress == 17:
        intervals_included = [2, 4, 5, 7]
    if progress == 18:
        intervals_included = [1, 3, 8, 9, 10, 11]
    if progress == 19:
        length = 20
    if progress == 21:
        length = 20
        width = 2
    if progress == 22:
        length = 50
        width = 2
    
    if infoOnly:
        session = {}
    else:
        session = generate_interval_session(intervals_included, directions, width, length)
    interval_names = [interval_names[x - 1] for x in intervals_included]
    session['interval_names'] = interval_names
    session['length'] = length
    session['directions'] = directions
    width_names = ['4', '3-5', '2-6']
    session['width'] = width_names[width]
    session['level'] = progress + 1
    session['totalProgress'] = round(((progress) / 23) * 100)
    return session

def generate_chords_session(chords_included, style, width, length, inversions):
    session = {}

    def get_start_note():
        number = random.randrange(12)
        note = notes.int_to_note(number)
        return note
    
    def get_octave(width=width):
        if width == 1:
            return random.randrange(3, 6)
        elif width == 2:
            return random.randrange(2, 7)
        else:
            return 4
    
    def get_type(types_included=chords_included):
        return random.choice(types_included)

    def get_chord_numbers(note, type, octave, inversions=inversions):
        
        if type == 0:
            c = chords.major_triad(note)
            name = 'Major'
        elif type == 1:
            c = chords.minor_triad(note)
            name = 'Minor'
        elif type == 2:
            c = chords.diminished_triad(note)
            name = 'Diminished'
        elif type == 3:
            c = chords.augmented_triad(note)
            name = 'Augmented'
        elif type == 4:
            c = chords.major_seventh(note)
            name = 'Major seventh'
        elif type == 5:
            c = chords.minor_seventh(note)
            name = 'Minor seventh'
        elif type == 6:
            c = chords.dominant_seventh(note)
            name = 'Dominant seventh'
        elif type == 7:
            c = chords.major_sixth(note)
            name = 'Major sixth'
        elif type == 8:
            c = chords.minor_sixth(note)
            name = 'Minor sixth'
        elif type == 9:
            c = chords.suspended_second_triad(note)
            name = 'Suspended second'
        elif type == 10:
            c = chords.suspended_fourth_triad(note)
            name = 'Suspended fourth'
        
        if len(inversions) > 1:
            n = random.choice(inversions)
            if n == 1:
                c = chords.first_inversion(c)
            elif n == 2:
                c = chords.second_inversion(c)


        chord_numbers = [int(Note(note, octave)) for note in c]
        for index, number in enumerate(chord_numbers):
                former_index = index - 1
                if number < chord_numbers[0] or (former_index >= 0 and number < chord_numbers[former_index]):
                    chord_numbers[index] += 12
        
        return chord_numbers, name
        

    chords_obj = {}

    for n in range(length):
        start_note = get_start_note()
        type = get_type()
        octave = get_octave()
        chord_numbers, chord_name = get_chord_numbers(start_note, type, octave)

        if style:
            chord_numbers = [[note] for note in chord_numbers]
        else:
            chord_numbers = [chord_numbers]

        chords_obj[n] = {
            'name': chord_name,
            'numbers': chord_numbers,
        }

    session['chords'] = chords_obj

    return session


def generate_progression_session(chords_included, start, length, progression_length, inversions):
    session = {}

    romans_list = ['I', 'IV', 'V', 'vi', 'ii', 'iii', 'I7', 'ii7', 'iii7', 'IV7', 'V7', 'vi7']

    def get_key():
        number = random.randrange(12)
        key = notes.int_to_note(number, 'b')
        return key
    
    def get_scale(key):
        return scales.Ionian(key)

    def get_chord_id(chords_included=chords_included):
        if chords_included == 0:
            chord_id = random.randrange(4)
        if chords_included == 1:
            chord_id = random.randrange(6)
        if chords_included == 2:
            chord_id = random.randrange(12)
        return chord_id

    def generate_chord(key, chord_id):
        
        if chord_id == 0:
            c = chords.I(key)
            name = chords.determine(c, True, True, True)[0]
            roman = 'I'
        elif chord_id == 1:
            c = chords.IV(key)
            name = chords.determine(c, True, True, True)[0]
            roman = 'IV'
        elif chord_id == 2:
            c = chords.V(key)
            name = chords.determine(c, True, True, True)[0]
            roman = 'V'
        elif chord_id == 3:
            c = chords.VI(key)
            name = chords.determine(c, True, True, True)[0]
            roman = 'vi'
        elif chord_id == 4:
            c = chords.II(key)
            name = chords.determine(c, True, True, True)[0]
            roman = 'ii'
        elif chord_id == 5:
            c = chords.III(key)
            name = chords.determine(c, True, True, True)[0]
            roman = 'iii'
        elif chord_id == 6:
            c = chords.I7(key)
            name = chords.determine(c, True, True, True)[0]
            roman = 'I7'
        elif chord_id == 7:
            c = chords.II7(key)
            name = chords.determine(c, True, True, True)[0]
            roman = 'ii7'
        elif chord_id == 8:
            c = chords.III7(key)
            name = chords.determine(c, True, True, True)[0]
            roman = 'iii7'
        elif chord_id == 9:
            c = chords.IV7(key)
            name = chords.determine(c, True, True, True)[0]
            roman = 'IV7'
        elif chord_id == 10:
            c = chords.V7(key)
            name = chords.determine(c, True, True, True)[0]
            roman = 'V7'
        elif chord_id == 11:
            c = chords.VI7(key)
            name = chords.determine(c, True, True, True)[0]
            roman = 'vi7'
        
        if len(inversions) > 1:
            n = random.choice(inversions)
            if n == 1:
                c = chords.first_inversion(c)
            elif n == 2:
                c = chords.second_inversion(c)


        chord_numbers = [int(Note(note)) for note in c]
        for index, number in enumerate(chord_numbers):
                former_index = index - 1
                if number < chord_numbers[0] or (former_index >= 0 and number < chord_numbers[former_index]):
                    chord_numbers[index] += 12
        
        return chord_numbers, name, roman    
    
    def create_chord_names(key):
        chord_names = []

        chords_list = [
            chords.I(key),
            chords.IV(key),
            chords.V(key),
            chords.VI(key),
            chords.II(key),
            chords.III(key),
            chords.I7(key),
            chords.II7(key),
            chords.III7(key),
            chords.IV7(key),
            chords.V7(key),
            chords.VI7(key),
        ]
        if chords_included == 0:
            n = 4
        elif chords_included == 1:
            n = 6
        else:
            n = 12
        
        
        
        for index, c in enumerate(chords_list[:n]):

            chord_numbers = [int(Note(note)) for note in c]
            for chordIndex, number in enumerate(chord_numbers):
                    former_index = chordIndex - 1
                    if number < chord_numbers[0] or (former_index >= 0 and number < chord_numbers[former_index]):
                        chord_numbers[chordIndex] += 12

            chord_names.append({
                'name': chords.determine(c, True, True, True)[0],
                'roman': romans_list[index],
                'numbers': chord_numbers
            })
            
        return chord_names
    
    progression_obj = {}
    chord_names_obj = {}
    for i in range(length):
        key = get_key()
        
        progression = []
        chord_names = create_chord_names(key)
        chord_names_obj[i] = chord_names
        for c in range(progression_length):
            
            chord_id = get_chord_id()
            if not start and not c:
                chord_id = 0

            chord_numbers, chord_name, chord_roman = generate_chord(key, chord_id)
            chords_obj = {
                'name': chord_name,
                'roman': chord_roman,
                'numbers': chord_numbers,
            }
            progression.append(chords_obj)
        progression_obj[i] = progression

    session['progressions'] = progression_obj
    session['chord_names'] = chord_names_obj

    return session

def generate_progression_progress_session(progress, infoOnly=False):
    
    if 0 <= progress <= 9:
        chords_included = 0
        start = 0
        progression_length = 4
        length = 10
        inversions = [0]
    if 10 <= progress <= 16:
        chords_included = 1
        start = 0
        progression_length = 4
        length = 10
        inversions = [0, 1, 2]
    if 17 <= progress:
        chords_included = 2
        start = 0
        progression_length = 4
        length = 10
        inversions = [0, 1, 2]

    if progress == 0:
        progression_length = 3
    if progress == 1:
        length = 20
    if 2 <= progress <=4:
        inversions = [0, 1]
    if 5 <= progress <=9:
        inversions = [0, 1, 2]
    if progress == 3:
        progression_length = 3
    if progress == 4:
        length = 20
    if progress == 6:
        progression_length = 5
    if progress == 7:
        start = 1
    if progress == 8:
        start = 1
        length = 20
    if progress == 9:
        start = 1
        progression_length = 5
        length = 20
    if progress == 10:
        inversions = [0]
    if progress == 12:
        length = 20
    if progress == 13:
        start = 1
    if progress == 14:
        start = 1
        length = 20
    if progress == 15:
        progression_length = 5
    if progress == 16:
        progression_length = 5
        start = 1
        length = 20
    if progress == 17:
        inversions = [0]
        progression_length = 3
    if progress == 18:
        inversions = [0]
        length = 20
    if progress == 20:
        progression_length = 5
    if progress == 21:
        start = 1
        length = 20
    if progress == 22:
        progression_length = 6
        length = 30
    if progress == 23:
        progression_length = 6
        length = 3
        start = 1
    
    if infoOnly:
        session = {}
    else:
        session = generate_progression_session(chords_included, start, length, progression_length, inversions)
    session['chords_included'] = 'Basic' if not chords_included else 'All diatonic' if chords_included == 1 else '+ seventh'
    session['length'] = length
    session['progression_length'] = progression_length
    start_alias = ['tonic', 'random']
    session['start'] = f'Start on {start_alias[start]}'
    inversion_alias = ['First inversion', 'Second inversion']
    session['inversions'] = ['No inversions'] if len(inversions) <= 1 else [inversion_alias[inversions[1:].index(x)] for x in inversions[1:]]
    session['level'] = progress + 1
    session['totalProgress'] = round(((progress) / 24) * 100)

    return session


def generate_melodies_session(notes_included, difficulty, start, length, melody_length):

    def get_numbers(notes_included=notes_included, length=melody_length, start=start, difficulty=difficulty):
        numbers = []
        if start:
            numbers.append(0)

        if notes_included:
            end_index = 23
        else:
            end_index = 13
        
        for i in range(length):
            if numbers:
                last_number = numbers[-1]
                max_jump = 3
                if difficulty == 1:
                    max_jump += 2
                if difficulty == 2: 
                    max_jump += 5

                range_start = max(last_number - max_jump + notes_included, 0)
                range_end = min(last_number + max_jump + notes_included, end_index)

                numbers.append(random.randrange(range_start, range_end))
            else:
                numbers.append(random.randrange(end_index))
        
        return numbers
        
    def get_key_numbers():
        diatonic_pattern = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24, 26, 28, 29, 31, 33, 35, 36, 38, 39, 40]
        key_numbers = []
        key_number = random.randrange(11) + 48
        for i in range(22):
            if 60 <= (key_number + diatonic_pattern[i]) <= 83:
                key_numbers.append(key_number + diatonic_pattern[i])
        
        key = notes.int_to_note(key_number - 48, 'b')
        
        return key_numbers, key

    def get_melody_obj(notes_included=notes_included):
        melody_obj = {}
        if not notes_included:
            key_numbers, key = get_key_numbers()
            melody_obj['key'] = key
            numbers = get_numbers()
        else: 
            key_numbers = list(range(60, 84))
        

        melody_numbers = [[key_numbers[x]] for x in numbers]
        melody_obj['numbers'] = melody_numbers
        melody_obj['all_notes'] = key_numbers

        return melody_obj

    session = {}
    session['melodies'] = {}
    for i in range(length):
        melody_obj = get_melody_obj()
        session['melodies'][i] = melody_obj
    
    return session
    

#Create stats objects

def create_interval_stats_object():
    progressLength = 23
    progressLevelStats = {}
    for i in range(progressLength):
        info = generate_interval_progress_session(i, infoOnly=True)
        progressObject = {
            'bestScore': 0,
            'bestScorePercent': 0,
            'info': info,
        }
        progressLevelStats[str(i + 1)] = progressObject
    progressStats = {
        'levelStats': progressLevelStats,
        'totalStats': {
                'completed': 0,
                'goal': progressLength,
                'progressPercent': 0,
        }
    }
    
    interval_names = ['Minor second', 'Major second', 'Minor third', 'Major third', 'Perfect fourth', 'Tritone', 'Perfect fifth', 'Minor sixth', 'Major sixth', 'Minor seventh', 'Major seventh', 'Octave']
    sessionStats = {}
    for interval in interval_names:
        sessionObject = {
            'total': 0,
            'correct': 0,
            'percent': 0,
        }
        sessionStats[interval] = sessionObject


    return sessionStats, progressStats

def create_progression_stats_object():
    progressLength = 24
    progressLevelStats = {}
    for i in range(progressLength):
        info = generate_progression_progress_session(i, infoOnly=True)
        progressObject = {
            'bestScore': 0,
            'bestScorePercent': 0,
            'info': info,
        }
        progressLevelStats[str(i + 1)] = progressObject
    progressStats = {
        'levelStats': progressLevelStats,
        'totalStats': {
                'completed': 0,
                'goal': progressLength,
                'progressPercent': 0,
        }
    }
    
    sessionStats = {'status': 'Coming soon'}


    return sessionStats, progressStats

def update_stats(eartrainingType, session, progress, newSessionStats, newProgressStats): 

    def update_progress(progress_length):
        level = str(progress['level'])
        print(newProgressStats)
        newProgressStats['levelStats'][level]['bestScore'] = max(int(newProgressStats['levelStats'][level]['bestScore']), int(progress['result']))
        newProgressStats['levelStats'][level]['bestScorePercent'] = round((int(newProgressStats['levelStats'][level]['bestScore']) / int(newProgressStats['levelStats'][level]['info']['length'])) * 100)
        total_completed = count_key_value_pairs(newProgressStats['levelStats'], 'bestScorePercent', 100)
        total_progress = round((total_completed / progress_length) * 100)
        newProgressStats['totalStats']['completed'] = total_completed
        newProgressStats['totalStats']['progressPercent'] = total_progress

    if eartrainingType == 'interval':
        if session:
            for interval, result in session.items():
                newSessionStats[interval]['total'] += int(result['total'])
                newSessionStats[interval]['correct'] += int(result['correct'])
                if newSessionStats[interval]['total']:
                    newSessionStats[interval]['percent'] = round((int(newSessionStats[interval]['correct']) / int(newSessionStats[interval]['total'])) * 100)
                else:
                    newSessionStats[interval]['percent'] = 0
        if progress:
            update_progress(23)
    
    if eartrainingType == 'progression':
        if progress:
            update_progress(24)

    return newSessionStats, newProgressStats

#Create chartdata
def create_chartdata(intervalSessionStats):
    intervalSessionChart = [
        {
            'name': intervalName,
            'total': value['total'],
            'correct': value['correct'],
            'wrong': value['total'] - value['correct'],
        } for intervalName, value in intervalSessionStats.items()
    ]

    return intervalSessionChart

#Unrelated functions
def count_key_value_pairs(dct, target_key, target_value):
    count = 0
    for inner_dct in dct.values():
        if target_key in inner_dct and inner_dct[target_key] == target_value:
            count += 1
    return count