import mingus.core.intervals as intervals
import mingus.core.chords as chords
import mingus.core.scales as scales
from mingus.containers import Note
import pretty_midi as pm
from midi2audio import FluidSynth
from pydub import AudioSegment
import tempfile
import random
import copy

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
            chord_numbers = [int(Note(note)) for note in c['chord']]
            for index, number in enumerate(chord_numbers):
                former_index = index - 1
                if number < chord_numbers[0] or (former_index >= 0 and number < chord_numbers[former_index]) or (number <= 47):
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
        song[f'verse{verse_index + 1}'] = new_verse

    return song, chords_out, ordered_chord_list

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
def generate_interval_session(intervals_included, directions, width, length, progression_rate):
    interval_names = ['Minor second', 'Major second', 'Minor third', 'Major third', 'Perfect fourth', 'Tritone', 'Perfect fifth', 'Minor sixth', 'Major sixth', 'Minor seventh', 'Major seventh', 'Octave']
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
        if 'Up' in directions:
            interval.append([root])
            interval.append([root + interval_number])
        if 'Down' in directions:
            interval.append([root])
            interval.append([root - interval_number])
        if 'Unison' in directions:
            interval.append([root, root + interval_number])
        interval_obj['numbers'] = interval
        interval_obj['name'] = interval_names[interval_number - 1]
        intervals[n] = interval_obj
    
    session = {
        'intervals': intervals,
        'progression_rate': progression_rate,
    }
    
    return session
