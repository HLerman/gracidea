//Imports
  import { Render } from "../render/render.ts"
  import type { World } from "../world/world.ts"
  import { App } from "../app.ts"
  import { global, event } from "./../render/settings.ts"

/**
 * Controller
 */
  export class Controller {

    /** App */
      private readonly app:App

    /** World */
      private readonly world:World

    /** Constructor */
      constructor({app, world}:{app:App, world:World}) {
        this.app = app
        this.world = world
        Render.app.view.addEventListener("wheel", (event:event) => {
          event.preventDefault()
          if (!this.world.minimap.open) {
            this.world.sprites.world.position.set(
              Math.round(this.world.sprites.world.position.x - event.deltaX),
              Math.round(this.world.sprites.world.position.y - event.deltaY),
            )
          } else {
            this.world.minimap.sprite.position.set(
              Math.round(this.world.minimap.sprite.position.x - event.deltaX),
              Math.round(this.world.minimap.sprite.position.y - event.deltaY),
            )
          }
          this.world.camera.render()
        })
        global.document.addEventListener("keydown", ({code}:event) => {
          switch (code) {
            case "ArrowLeft":
              this.world.camera.x--
              this.world.camera.render()
              break
            case "ArrowRight":
              this.world.camera.x++
              this.world.camera.render()
              break
            case "ArrowUp":
              this.world.camera.y--
              this.world.camera.render()
              break
            case "ArrowDown":
              this.world.camera.y++
              this.world.camera.render()
              break
          }
        })
        global.document.querySelector("[data-control-for='map']")?.addEventListener("click", () => this.world.minimap.toggle())
        global.document.querySelector("[data-control-for='debug']")?.addEventListener("click", () => {
          global.document.querySelector("nav.debug").style.display = global.document.querySelector("nav.debug").style.display === "flex" ? "none" : "flex"
        })
        Object.keys(App.debug).forEach(key => {
          const input = global.document.createElement("input")
          input.setAttribute("data-control-for", key)
          input.setAttribute("type", "checkbox")
          input.checked = App.debug[key as keyof typeof App.debug]
          input.addEventListener("change", () => App.debug[key as keyof typeof App.debug] = input.checked)
          const label = global.document.createElement("label")
          label.innerText = key
          label.prepend(input)
          global.document.querySelector(".debug")?.append(label)
        })
        console.log(App.debug)
      }

    /** update DOM */
      updateDOM() {
        //Location
          const location = global.document.querySelector("#location .name")
          if (location)
            location.innerHTML = this.world.camera.location[0] ?? "-  "
        //Position
          const position = global.document.querySelector("#location .position")
            if (position)
              position.innerHTML = `${this.world.camera.x};${this.world.camera.y}`
      }

  }