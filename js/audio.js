class AudioEngine {
  BACKGROUND_MUSIC = new Audio("sounds/music2.mp3");

  SOUND_SNAKE_MOVE = "sounds/move.mp3";
  SOUND_SNAKE_EAT = "sounds/eat.mp3";
  SOUND_SNAKE_DEAD = "sounds/iff.mp3";

  CHECKBOX_MUTE_CONTROL = document.querySelector("#checkbox");

  constructor() {
    this.CHECKBOX_MUTE_CONTROL.checked = true;
    this.BACKGROUND_MUSIC.loop = true;

    this.CHECKBOX_MUTE_CONTROL.addEventListener("change", (e) =>
      this.muteControlDriver()
    );

    this.BACKGROUND_MUSIC.addEventListener("timeupdate", function () {
      console.log('timeupdate event fired', this.currentTime)
      const buffer = 0.44;

      if (
        this.currentTime >
        this.duration - buffer
      ) {
        this.currentTime = 0;
        this.play();

        console.log('music is ready')
      }
    });
  }

  isMuted = () => !this.CHECKBOX_MUTE_CONTROL.checked;

  muteControlDriver() {
    if (!this.isMuted()) {
      this.playBackgroundMusic();
    } else {
      this.stopBackgroundMusic();
    }
  }


  playBackgroundMusic() {
    if (!this.isMuted()) {
      console.log('call _gaplessMusicLoop()')
      this.BACKGROUND_MUSIC.play();

      // console.log('music is ready')

    }
  }


  stopBackgroundMusic() {
    this.BACKGROUND_MUSIC.pause();
  }

  playSound(soundType) {
    if (!this.isMuted()) {
      let sound;

      switch (soundType) {
        case "eat":
          sound = new Audio(this.SOUND_SNAKE_EAT);
          break;
        case "move":
          sound = new Audio(this.SOUND_SNAKE_MOVE);
          break;
        default:
          sound = new Audio(this.SOUND_SNAKE_DEAD);
      }
      sound.play();
    }
  }
}
