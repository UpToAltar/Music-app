
// 1: Render sóng
// 2 : Scroll thu nhỏ CD
// 3: Play/ pause/seek (seek là thanh trượt progress)
// 4: CD rotate
// 5: Next/ prev
// 6: Random
// 7: Next, repeat khi end  audio
// 8: Active song
// 9: Scroll active song into view
// 10: play song when click
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const volume = $('.volume-progress')
const volumeBarActive = $('#progress-volume-bar')
const player = $(".player");
const headAuthor = $(".head-author");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,

  // (1/2) Uncomment the line below to use localStorage
  // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Waiting For You",
      singer: "MONO",
      path: "./song-list/WaitingForYou.mp3",
      image:
        "https://i.vietgiaitri.com/2022/8/9/tan-binh-mono-vua-debut-da-len-thang-top-1-a74-6584693.jpg",
    },
    {
      name: "Sài Gòn Đau Lòng Quá",
      singer: "Hứa Kim Tuyền, Hoàng Duyên",
      path: "./song-list/SaiGonDauLongQua.mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2021/03/27/d/2/9/1/1616859493571_500.jpg",
    },
    {
      name: "Anh Thanh Niên",
      singer: "HuyR",
      path: "./song-list/AnhThanhNien.mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2020/01/21/e/0/f/1/1579574645587_500.jpg",
    },
    {
      name: "Hãy Ra Khỏi Người Đó Đi",
      singer: "Phan Mạnh Quỳnh",
      path: "./song-list/HayRaKhoiNguoiDoDi.mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/playlist/2016/09/04/e/c/2/9/1472959129457_500.jpg",
    },
    {
      name: "Thằng Điên",
      singer: "Justatee",
      path: "./song-list/ThangDien.mp3",
      image:
        "https://c-fa.cdn.smule.com/rs-s91/arr/76/a4/9a914da5-2cc9-4fa0-93f3-e46e91bb8bd0_1024.jpg",
    },
    {
      name: "Bông Hoa Đẹp Nhất",
      singer: "QuânAP",
      path: "./song-list/BongHoaDepNhat.mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2020/09/10/5/e/e/3/1599731826319_500.jpg",
    },
    {
      name: "Tệ Thật Anh Nhớ Em",
      singer: "Thanh Hưng",
      path: "./song-list/TeThatAnhNhoEm.mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2022/03/03/0/1/3/6/1646267009685_500.jpg",
    },
    {
      name: "Có Hẹn Với Thanh Xuân",
      singer: "MOONSTAR",
      path: "./song-list/cohenvoithanhxuan.mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2021/07/16/f/4/9/8/1626425507034_500.jpg",
    },
    {
      name: "Nơi Này Có Anh",
      singer: "Sơn Tùng MTP",
      path: "./song-list/NoiNayCoAnh.mp3",
      image:
        "https://avatar-ex-swe.nixcdn.com/song/2017/05/19/0/4/d/e/1495165764676_500.jpg",
    },
  ],
  render: function (){
    const htmls = this.songs.map((song,index) => `
        <div class="song ${index == app.currentIndex ? 'active' : ''} " data-index="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
      `)
    
    playlist.innerHTML = htmls.join('')

  },
  getCurrentSong: function(){
    return this.songs[this.currentIndex]
  },
  loadCurrentSong: function(){
    heading.innerHTML = this.getCurrentSong().name
    headAuthor.innerHTML = this.getCurrentSong().singer
    cdThumb.style.backgroundImage = `url(${this.getCurrentSong().image})`;
    audio.setAttribute('src', this.getCurrentSong().path)
  },

  handleEvents: function(){
    // ! Khi scroll thì thu nhỏ CD
    const cdWidth = cd.offsetWidth;
    document.onscroll = () => {
      const scrollTop = window.scrollY;
      const cdNewWidth = cdWidth - scrollTop;

      cd.style.width = cdNewWidth >= 0 ? cdNewWidth + "px" : 0;
      cd.style.opacity = cdNewWidth / cdWidth;
    };
    
    // * Xử lí CD quay
    const cdRotate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 giây
      iterations: Infinity,
    });
    cdRotate.pause();
    // ! Xử lí volume
    volume.oninput = function () {
      // xử lí màu khi di chuyển
      volumeBarActive.style.width = this.value + "%";
      audio.volume = this.value/ 100
      
    };
    // ! Khi click thì chuyển nút và phát nhạc
    playBtn.onclick = function () {
      if (player.classList.contains('playing')) {
        player.classList.remove("playing");
        audio.pause();
        cdRotate.pause();
      } else {
        player.classList.add("playing");
        audio.play();
        cdRotate.play();
      }
    };

    // ! Khi phát nhạc thanh progress di chuyển
    // Lấy giá trị % cho vào value của progress
    // Giá trị là thời gian hiện tại : thời gian tổng *100
    audio.ontimeupdate = function () {
      if (this.duration) {
        const progressPercent = Math.floor(
          (this.currentTime / this.duration) * 100
        );

        progress.value = progressPercent;
      }
    };

    // * Xử lí tua
    progress.oninput = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
      if (!(player.classList.con)) {
        player.classList.add("playing");
        audio.play();
        cdRotate.play();
      }
    };

    // ! Next và prev
    nextBtn.onclick = function(){
      // Nếu nút random active thì chuyển bài ngẫu nhiên
      if (randomBtn.classList.contains("active")) {
        app.getIndexRandomSong();
      } else{ //Nếu bình thg thì next bài
        if (app.currentIndex < app.songs.length - 1) {
          app.currentIndex += 1;
        } else {
          app.currentIndex = 0;
        }
      }
      playSong()
      app.render() //render lại list song để class active được chèn vào
      app.scrollIntoActiveView()// gọi hàm scroll to view
    }

    prevBtn.onclick = function () {
      // Nếu nút random active thì chuyển bài ngẫu nhiên
      if(randomBtn.classList.contains('active')){
        app.getIndexRandomSong()
      } else { //Nếu bình thg thì prev bài
        if (app.currentIndex > 0) {
          app.currentIndex -= 1;
        } else {
          app.currentIndex = app.songs.length - 1;
        }
      }
      playSong()
      app.render() //render lại list song để class active được chèn vào
      app.scrollIntoActiveView()// gọi hàm scroll to view
    };

    // ? tạo function playSong 
    function playSong(){
      if (!(player.classList.contains('playing'))) {
        player.classList.add("playing");
        cdRotate.play();
      }
      app.loadCurrentSong();
      audio.play();
    }

    // ! tạo random bài hát
    randomBtn.onclick = function(){
      this.classList.toggle("active")
      if(this.classList.contains("active")){
        app.getIndexRandomSong()
      }
    }

    // ! Tạo repeat bài hát
    repeatBtn.onclick = function(){
      this.classList.toggle('active')
    }

    // ! Khi end bài hát
    audio.onended = function(){
      // Nếu đang ấn repeat thì phát luôn bài đó
      if(repeatBtn.classList.contains('active')){
        audio.play()
      } else {
        // Nếu bình thường thì tự ấn nút next chuyển bài
        nextBtn.click()
      }
    }  

    // ! Xử lí choose song
    playlist.onclick = function(e){
      const songNode = e.target.closest('.song:not(.active)')
      if (songNode || e.target.closest(".option")) {
        app.currentIndex = Number(songNode.getAttribute("data-index"));
        if (!player.classList.contains("playing")) {
          player.classList.add("playing");
          cdRotate.play();
        }
        app.loadCurrentSong()
        audio.play()
        app.render()
        app.scrollIntoActiveView()
      }
      
    }
  },
  getIndexRandomSong: function(){
    // ! Random bài hát ( tạo số random ngẫu nhiên để gán vào currentIndex)
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * this.songs.length);
    } while (this.currentIndex === randomIndex);
    {
      this.currentIndex = randomIndex;
    }
  },
  scrollIntoActiveView: function(){
    // ! Hàm scroll to view
    setTimeout(()=>{
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      })
    },200)
  },

  start: function(){
    // Lấy currentSong
    this.getCurrentSong()
    // Load the current song
    this.loadCurrentSong()
    
    // Các sự kiện
    this.handleEvents()
    // Hàm rander ra playlist
    this.render()
  }
};
