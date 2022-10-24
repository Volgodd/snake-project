class AudioEngine {
  BACKGROUND_MUSIC = new Audio("sounds/music2.mp3");

  SOUND_SNAKE_MOVE = "sounds/move.mp3";
  SOUND_SNAKE_EAT = "sounds/eat.mp3";
  SOUND_SNAKE_DEAD = "sounds/iff.mp3";

  CHECKBOX_MUTE_CONTROL = document.querySelector("#checkbox");

  LOCAL_STORAGE_NAME_CHECKBOX = "Checkbox";

  constructor() {
    this.CHECKBOX_MUTE_CONTROL.checked = false;
    this.BACKGROUND_MUSIC.loop = true;

    this.CHECKBOX_MUTE_CONTROL.addEventListener("change", (e) => {
      this.muteControlDriver();
      this.checkboxStateLocalStorage();
    });

    this.BACKGROUND_MUSIC.addEventListener("timeupdate", function () {
      const buffer = 0.44;

      if (this.currentTime > this.duration - buffer) {
        this.currentTime = 0;
        this.play();
      }
    });

    this.checkPreviousMuteStatus();
  }

  isMuted = () => !this.CHECKBOX_MUTE_CONTROL.checked;

  checkPreviousMuteStatus() {
    if (
      localStorage.getItem(this.LOCAL_STORAGE_NAME_CHECKBOX) === "unchecked"
    ) {
      this.CHECKBOX_MUTE_CONTROL.checked = false;
    } else if (
      localStorage.getItem(this.LOCAL_STORAGE_NAME_CHECKBOX) === "checked"
    ) {
      this.CHECKBOX_MUTE_CONTROL.checked = true;
    }
  }

  checkboxStateLocalStorage() {
    if (!this.CHECKBOX_MUTE_CONTROL.checked) {
      localStorage.setItem(this.LOCAL_STORAGE_NAME_CHECKBOX, "unchecked");
    } else if (this.CHECKBOX_MUTE_CONTROL.checked)
      localStorage.setItem(this.LOCAL_STORAGE_NAME_CHECKBOX, "checked");
  }

  muteControlDriver() {
    if (!this.isMuted()) {
      this.playBackgroundMusic();
    } else {
      this.stopBackgroundMusic();
    }
  }

  playBackgroundMusic() {
    if (!this.isMuted()) {
      this.BACKGROUND_MUSIC.play();
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
