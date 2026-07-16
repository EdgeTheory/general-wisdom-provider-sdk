#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.8"
# dependencies = [
#     "pyttsx3",
# ]
# ///

import pyttsx3


def list_voices():
    """List all available TTS voices on the system."""
    engine = pyttsx3.init()
    voices = engine.getProperty("voices")

    print("Available TTS Voices:")
    print("=" * 60)

    for i, voice in enumerate(voices):
        print(f"\n[{i}] Voice ID: {voice.id}")
        print(f"    Name: {voice.name}")
        print(f"    Languages: {voice.languages}")
        print(f"    Gender: {voice.gender}")
        print(f"    Age: {voice.age}")


if __name__ == "__main__":
    list_voices()
