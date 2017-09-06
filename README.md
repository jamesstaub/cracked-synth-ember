# cracked-synth-ember

## [an app for composing sound doodles](https://cracked-doodles.firebaseapp.com)
using Bill Orcutt's [Cracked](idroppedmyphonethescreencracked.tumblr.com) library for web audio


## tone lattice
a generative synthesizer that randomly traverses a pitches in an interval matrix.

first a random root note is chosen in the matrix
then other voices are randomly selected within a nearby range of the root note on the x or y axis.

## euclidean rhythm sequencer
implements a multitrack euclidean rhythm drum machine
with the ability to modulate the speed and loop time on each step of the sequence.  (very work in progress)
