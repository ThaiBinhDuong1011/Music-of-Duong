const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "FAMILY_PLAYER";

const heading = $("header h2");
const player = $(".player");
const cd = $(".cd");
const cdThumb = $(".cd-thumb");
const playBtn = $(".btn-toggle-play");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playProgress = $(".play-progress");
const audio = $("#audio");
const playList = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Cắt Đôi Nỗi Sầu",
      singer: "Tăng Duy Tân",
      path: "./assets/audios/CẮT ĐÔI NỖI SẦU.mp3",
      image: "./assets/images/cắt-đôi-nỗi-sầu.jpg",
    },
    {
      name: "Tòng Phu",
      singer: "Keyo",
      path: "./assets/audios/TÒNG PHU.mp3",
      image: "./assets/images/tòng-phu.jpg",
    },
    {
      name: "Em Là Kẻ Đáng Thương",
      singer: "Phát Huy T4",
      path: "./assets/audios/EM LÀ KẺ ĐÁNG THƯƠNG.mp3",
      image: "./assets/images/em-là-kẻ-đáng-thương.jpg",
    },
    {
      name: "Thất Tình",
      singer: "Trịnh Đình Quang",
      path: "./assets/audios/Thất Tình.mp3",
      image: "./assets/images/thất-tình.jpg",
    },
    {
      name: "Rượu Mừng Hóa Người Dưng",
      singer: "Qinn Media, TLong",
      path: "./assets/audios/Rượu Mừng Hóa Người Dưng.mp3",
      image: "./assets/images/rượu-mừng-hóa-người-dưng.jpg",
    },
    {
      name: "Đánh Mất Em",
      singer: "Quang Đăng Trần, Freak D",
      path: "./assets/audios/ĐÁNH MẤT EM.mp3",
      image: "./assets/images/đánh-mất-em.jpg",
    },
    {
      name: "Người Lạ Thoáng Qua",
      singer: "Đinh Tùng Huy",
      path: "./assets/audios/NGƯỜI LẠ THOÁNG QUA.mp3",
      image: "./assets/images/người-lạ-thoáng-qua.jpg",
    },
    {
      name: "Phấn Hoa Màu Son",
      singer: "H-Kray, Thoại Mỹ",
      path: "./assets/audios/PHẤN HOA MÀU SON.mp3",
      image: "./assets/images/phấn-hoa-màu-son.jpg",
    },
    {
      name: "Miên Man",
      singer: "Minh Huy",
      path: "./assets/audios/Miên Man.mp3",
      image: "./assets/images/miên-man.jpg",
    },
    {
      name: "Dịu Dàng Yêu",
      singer: "Đào Duy Quý, Lil'Wuan",
      path: "./assets/audios/Dịu Dàng Yêu.mp3",
      image: "./assets/images/dịu-dàng-yêu.jpg",
    },
    {
      name: "Thân Sinh Phụ Mẫu",
      singer: "BÌN x JIN TUẤN NAM",
      path: "./assets/audios/THÂN SINH PHỤ MẪU.mp3",
      image: "./assets/images/than-sinh-phu-mau.jpg",
    },
    {
      name: "Nhân Sinh Quán",
      singer: "JIN TUẤN NAM l COVER ÚT NHỊ",
      path: "./assets/audios/NHÂN SINH QUÁN.mp3",
      image: "./assets/images/nhan-sinh-quan.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const html = this.songs.map((song, index) => {
      return `
            <div class="song ${index === this.currentIndex ? "active" : ""
        }"data-index="${index}">
                <div class="thumb" 
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
        `;
    });
    playList.innerHTML = html.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvent: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay / dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();

    // Xử lý phóng to thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = document.documentElement.scrollTop || window.scrollY;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? `${newCdWidth}px` : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được play
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi song được pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    // Khi prev song
    prevBtn.onclick = function () {
      this.classList.toggle("active");
      setTimeout(() => {
        this.classList.toggle("active");
      }, 200);
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi next song
    nextBtn.onclick = function () {
      this.classList.toggle("active");
      setTimeout(() => {
        this.classList.toggle("active");
      }, 200);
      if (_this.isRandom) {
        _this.randomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi repeat song
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Khi random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progress = Math.floor((audio.currentTime / audio.duration) * 100);
        playProgress.value = progress;
      }
    };

    // Xử lý khi tua song
    playProgress.oninput = function () {
      const seekTime = audio.duration * (this.value / 100);
      audio.currentTime = seekTime;
    };

    // Khi kết thúc bài hát
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };
    // Lắng nghe hành vi click vào playlist
    playList.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // Xử lý khi click vào song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
        // Xử lý khi click vào option
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  loadConfig: function () {
    this.isRepeat = this.config.isRepeat;
    this.isRandom = this.config.isRandom;
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
    audio.src = this.currentSong.path;
  },
  scrollToActiveSong: function () {
    if (this.currentIndex === 0) {
      setTimeout(() => {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
    } else {
      setTimeout(() => {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }, 100);
    }
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  randomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // Gán cấu hình từ config vào ứng dụng
    this.loadConfig();
    // Định nghĩa các thuộc tính cho object
    this.defineProperties();

    // Lắng nghe / xử lý các sự kiện (DOM events)
    this.handleEvent();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    this.loadCurrentSong();

    // Render Playlist
    this.render();

    // Hiển thị trạng thái ban đầu của button repeat & random
    repeatBtn.classList.toggle("active", this.isRepeat);
    randomBtn.classList.toggle("active", this.isRandom);
  },
};

app.start();

$(".fa-moon").onclick = function () {
  $(".fa-moon").classList.add("active");
  $(".fa-sun").classList.add("active");
  $(".fa-sun").classList.remove("up");
  $(".fa-moon").classList.remove("up");
  $(".play-zone").classList.add("active");
  $(".playlist").classList.add("active");
  document.querySelector("html").style.background =
    "url(../assets/images/background-moon.jpg)  no-repeat";
  document.querySelector("html").style.backgroundSize = "cover";
  document.querySelector("html").style.backgroundPosition = "center center";
};

$(".fa-sun").onclick = function () {
  $(".fa-sun").classList.remove("active");
  $(".fa-sun").classList.add("up");
  $(".fa-moon").classList.remove("active");
  $(".fa-moon").classList.add("up");
  $(".play-zone").classList.remove("active");
  $(".playlist").classList.remove("active");
  document.querySelector("html").style.background =
    "url(../assets/images/background-sun.jpg)  no-repeat";
  document.querySelector("html").style.backgroundSize = "cover";
  document.querySelector("html").style.backgroundPosition = "center center";
};
