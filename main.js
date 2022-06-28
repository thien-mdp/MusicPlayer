const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'PLAYER'

const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextSongBtn = $('.btn-next')
const prevSongBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    

    songs: [{
            name: 'Waiting For Love',
            singer: 'Avicii',
            path: './assets/music/song1.mp3',
            image: './assets/img/wfl.jpg'
        },
        {
            name: 'Nevada - Đi Đi Đi',
            singer: 'Daniel Mastro Mashup Remix',
            path: './assets/music/Nevada-Monstercat-6983746.mp3',
            image: './assets/img/dididixnevada.jpg'
        },
        {
            name: 'Thiêu Thân',
            singer: 'Bray x Sofia',
            path: './assets/music/thieuthan.mp3',
            image: './assets/img/165998.jpg'
        },
        {
            name: 'Ngày Khác Lạ',
            singer: 'Đen, Giang Phạm, Triple D ',
            path: './assets/music/NgayKhacLa-DenDJGiangPhamTripleD-5393909.mp3',
            image: './assets/img/ngaykhacla.jpg'
        },
        {
            name: 'The Fat Rat',
            singer: 'Unity',
            path: './assets/music/Unity-TheFatRat-3578590.mp3',
            image: './assets/img/fatrat.jpg'
        },
        {
            name: 'Gucci Gang',
            singer: 'Lil-Pump',
            path: './assets/music/guccigang.mp3',
            image: './assets/img/lilpump.jpg'
        },
        {
            name: 'Gieo Quẻ',
            singer: 'Hoàng Thùy Linh - Đen Vâu',
            path: './assets/music/GieoQue-HoangThuyLinhDen-7125031.mp3',
            image: './assets/img/gieoque.jpg'
        },
        {
            name: 'Vì Mẹ Anh Bắt Chia Tay',
            singer: 'Miu Lê - Karik - Châu Đăng Khoa',
            path: './assets/music/vimeanhbatchiatay.mp3',
            image: './assets/img/vimeanhbct.jpg'
        },
        {
            name: 'Hẹn Gặp Em Dưới Ánh Trăng',
            singer: 'HIEUTHUHAI',
            path: './assets/music/hengapemduoianhtrang.mp3',
            image: './assets/img/hengapemduoianhtrang.jpg'
        },
        {
            name: 'Bật Nhạc Lên',
            singer: 'HIEUTHUHAI - Harmonie',
            path: './assets/music/BatNhacLen1-HIEUTHUHAIHarmonie-6351919.mp3',
            image: './assets/img/batnhaclen.jpg'
        },
        {
            name: 'Yêu Người Như Anh',
            singer: 'Đạt G - Bray - Masew',
            path: './assets/music/yeunguoinhuanh.mp3',
            image: './assets/img/yeunguoinhuanh.jpg'
        },
        {
            name: 'Việt Nam Những Chuyến Đi',
            singer: 'Vicky Nhung',
            path: './assets/music/vnnhungchuyendi.mp3',
            image: './assets/img/vnnhungchuyendi.jpg'
        }
    ],

    setConfig: function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
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
            `
        })
        playlist.innerHTML = htmls.join('')
        
    },

    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function () {
        const cdWidth = cd.offsetWidth
        const _this = this

        //xử lý cd quay 
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()
        //xử lý phóng to thu nhỏ CD
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth >0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            } else {
                audio.play()
            } 
        }
        // khi song - play 
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }
        // khi song - pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }
        // khi tiến trình bài hát thay đổi 
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                progress.value = progressPercent
            }
        }
        // xử lý khi tua 
        progress.oninput = function(e){
            const changeProgress = Math.floor(audio.duration  / 100 * e.target.value)
            audio.currentTime = changeProgress
        }
        // khi click next bài
        nextSongBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // khi click lùi bài
        prevSongBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong()
            }else{
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        // Random playlist
        randomBtn.onclick = function(e){
                _this.isRandom = !_this.isRandom
                _this.setConfig('isRandom', _this.isRandom)
                const a = randomBtn.classList.toggle('active',_this.isRandom)
                if(a){
                    toast({
                    title: 'Random Playlist !',
                    message: 'Turn on!',
                    type: 'success',
                    duration: 2500
                });
                }else {
                    toast({
                        title: 'Random Playlist !',
                        message: 'Turn off!',
                        type: 'warning',
                        duration: 2500
                    });
                }
        }
        //xử lý lặp lại bài hát
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            const a = repeatBtn.classList.toggle('active', _this.isRepeat)
            if(a){
                toast({
                    title: 'Repeat Song ',
                    message: 'Turn on!',
                    type: 'success',
                    duration: 2500
                });
            }else {
                toast({
                    title: 'Repeat Song',
                    message: 'Turn off!',
                    type: 'warning',
                    duration: 2500
                });
            }
        }
        // xử lý khi nextsong khi hết bài
        audio.onended = function() {
            if(_this.isRepeat){
                audio.play();
            }else{
                nextSongBtn.click()
            }
        }
        // xử lý click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option') ){
                // xu lys khi click vao song
                if (songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }   

            }
        }
    },

    scrollToActiveSong(){
        const songActive = $('.song.active')
        
        setTimeout(() => {
            songActive.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
            if(this.currentIndex === 0) {
                document.documentElement.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
            }
        },150)
        
        
    },

    loadCurrentSong(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
        
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
    },
    nextSong: function(){
        this.currentIndex ++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function(){
        this.currentIndex --
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    playRandomSong: function(){
        let newIndex
        do{
            newIndex = Math.floor(Math.random()*this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function () {
        // gan cau hinh tu config vao ung dung
        this.loadConfig()
        // định nghĩa các thuộc tính
        this.defineProperties() 

        // xử lý các sự kiện (DOM events)
        this.handleEvents()

        // tải thông tin bài đầu tiên
        this.loadCurrentSong()

        //render playlist
        this.render();
        
        //hien thi trang thai ban dau cua  button repeat & random
        repeatBtn.classList.toggle('active', this.isRepeat)
        randomBtn.classList.toggle('active',this.isRandom)
    }

}
app.start();
