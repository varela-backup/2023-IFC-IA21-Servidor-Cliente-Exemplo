
// ---✀------------------------------------------------------
// ENCONTRANDO DOM DOS PLAYERS
// 
const containers = document.querySelectorAll("div.ia21-player")

// ---✀------------------------------------------------------
// PERCORRENDO TODOS OS PLAYERS
// 
containers.forEach(async container => {
  // ---✀------------------------------------------------------
  // ENCONTRANDO ELEMENTOS DOM DO PLAYER 
  //
  const btPlayPause = container.querySelector("button.play-pause")
  const video = container.querySelector("video")
  const timeline = container.querySelector(".dragbar.timeline")
  const timelineDrag = timeline.querySelector(".draggable")
  const timer = container.querySelector(".timer")
  const dragbars = container.querySelectorAll(".dragbar")
  const playlist = container.querySelector(".playlist")

  // ---✀------------------------------------------------------
  // LER PLAYLIST DO ARQUIVO JSON
  //

  const requisicao = await fetch(container.dataset.playlist)
  const lista = await requisicao.json()
  
  // for (let i = 0; i < lista.length; i++) {
  //   const filme = lista[i]
  //   const div = document.createElement("div")
  //   div.innerHTML = filme.title
  //   playlist.append(div)
  // }
  
  lista.forEach(filme => {
    const div = document.createElement("div")
    div.innerHTML = filme.title
    playlist.append(div)
  })
  
  // ---✀------------------------------------------------------
  // BOTÃO PLAY PAUSE
  //
  
  btPlayPause.addEventListener("click", () => {
    if (video.paused) {
      video.play()
      btPlayPause.innerText = btPlayPause.dataset.pauseIcon
      return
    }

    video.pause()
    btPlayPause.innerText = btPlayPause.dataset.playIcon
  })

  // ---✀------------------------------------------------------
  // CONTADOR DE TEMPO
  //
  
  video.addEventListener("timeupdate", () => {
    const percent = (video.currentTime / video.duration) * 100
    const s = Math.floor(video.currentTime)
    const m = Math.floor(s / 60)
    const h = Math.floor(m / 60)
    const sh = `${h % 60}`.padStart(2, "0")
    const sm = `${m % 60}`.padStart(2, "0")
    const ss = `${s % 60}`.padStart(2, "0")
    timelineDrag.style.setProperty("--percent", `${percent}%`)
    timer.innerText = `${sh}:${sm}:${ss}`
  })

  // ---✀------------------------------------------------------
  // BARRAS (TIMELINE E VOLUME) 
  //
  dragbars.forEach(dragbar => {
    const dragabble = dragbar.querySelector(".draggable")

    if (dragbar.classList.contains("volume")) {
      dragabble.style.setProperty("--percent", `100%`)
    }

    dragbar.addEventListener("mousedown", ev => {
      dragbar.classList.add("dragging")
    })

    dragbar.addEventListener("mouseup", ev => {
      dragbar.classList.remove("dragging")
    })

    dragbar.addEventListener("mouseout", ev => {
      dragbar.classList.remove("dragging")
    })

    dragbar.addEventListener("mousemove", ev => {
      if (ev.target != dragbar || !dragbar.classList.contains("dragging"))
        return

      const width = Math.floor(dragbar.getBoundingClientRect().width)
      const index = (ev.offsetX / width)
      const percent = index * 100

      dragabble.style.setProperty("--percent", `${percent}%`)
    })

    dragbar.addEventListener("mouseup", ev => {
      if (ev.target != dragbar)
        return

      const width = Math.floor(dragbar.getBoundingClientRect().width)
      const index = (ev.offsetX / width)
      const percent = index * 100

      dragabble.style.setProperty("--percent", `${percent}%`)

      if (dragbar.classList.contains("timeline")) {
        video.currentTime = video.duration * index
        return
      }

      if (dragbar.classList.contains("volume")) {
        video.volume = index
        return
      }
    })
  })
})