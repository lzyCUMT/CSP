<script >
export default {

  data() {
    return {
      isTaxMode: false,
      tax: [
        {
          name: 'USD-美元',
          tax: 0.13694879,
        },
        {
          name: 'EUR-欧元',
          tax: 0.12921032,
        },
        {
          name: 'JPY-日元',
          tax: 20.556105,
        },
        {
          name: 'GBP-英镑',
          tax: 0.11224333,
        },
        {
          name: 'HKD-港币',
          tax: 1.0690255,
        }
      ]
    }
  },
  methods: {
    changeMode() {
      let screenExpression = document.getElementsByClassName('screen')[0]
      this.isTaxMode = true;
      screenExpression.innerHTML = ''
    }
  },
  mounted() {

    const numButtons = document.querySelectorAll(".num")
    const controllerButtons = document.querySelectorAll(".controller")
    const operatorButtons = document.querySelectorAll(".operator")
    const gridItem = document.querySelectorAll(".grid-item")
    const getResultButton = document.getElementById("getResult")
    const calBox = document.querySelector(".cal")
    const screenBox = document.querySelector(".screenBox")
    // const inputs = document.querySelectorAll('input') 
    let screenExpression = document.getElementsByClassName('screen')[0]
    let expression = ""
    let expressionObj = {
      exp: expression
    }
    const expressionProxy = new Proxy(expressionObj, {
      get(target, property) {
        return target[property];
      },
      set(target, property, value) {
        console.log("写入字符串");
        target[property] = value;
        screenExpression.innerHTML = value
        return true;
      }
    });
    for (let i = 0; i < numButtons.length; i++) {
      numButtons[i].addEventListener('click', () => {
        expressionProxy.exp = expressionProxy.exp + numButtons[i].innerHTML
      })
    }
    for (let i = 0; i < operatorButtons.length; i++) {
      const ob = operatorButtons[i]
      ob.addEventListener('click', () => {
        const last = expressionProxy.exp[expressionProxy.exp.length - 1]
        if (last === "*" || last === "-" || last === "/" || last === "+") {
          // expressionProxy.exp = expressionProxy.exp.slice(0, -1);
          expressionProxy.exp = expressionProxy.exp + ob.innerHTML;
        } else {
          expressionProxy.exp = expressionProxy.exp + ob.innerHTML;
        }

      })
    }
    for (let i = 0; i < controllerButtons.length; i++) {
      const cb = controllerButtons[i]
      if (cb.innerHTML === "AC") {
        cb.addEventListener('click', () => {
          expressionProxy.exp = ""
        })
      } else if (cb.innerHTML === "Del") {
        cb.addEventListener('click', () => {
          expressionProxy.exp = expressionProxy.exp.slice(0, -1);
        })
      } else if (cb.innerHTML === "Dark") {
        cb.addEventListener('click', () => {
          if (cb.innerHTML === "Dark") {
            calBox.style.backgroundColor = "#1f2428"
            screenBox.style.color = "#ffffff"
            gridItem.forEach((item) => {
              item.style.backgroundColor = "#2b3036"
              item.style.color = "white"
            })
            cb.innerHTML = "Day"
          } else {
            calBox.style.backgroundColor = "#ffffff"
            screenBox.style.color = "#1f2428"
            gridItem.forEach((item) => {
              item.style.backgroundColor = "#f6f6f6"
              item.style.color = "#505050"
            })
            cb.innerHTML = "Dark"
          }

        })
      } else if (cb.innerHTML === "Rand") {
        cb.addEventListener('click', () => {
          const rand = Math.random() + "";
          expressionProxy.exp = rand.slice(0, 5);
        })
      }
    }
    getResultButton.addEventListener("click", () => {
      try {
        const result = parseFloat(eval(expressionProxy.exp).toFixed(10));
        expressionProxy.exp = String(result);
      } catch {
        expressionProxy.exp = "Error";
        setInterval(() => {
          expressionProxy.exp = "";
        }, 1500)
      }
    })
  },
}
</script>

<template>
  <div class="cal">
    <div class="screenBox">
      <div class="screen">
      </div>
    </div>
    <div class="taxs" v-show="isTaxMode">
      <div v-for="item in tax" class="tax">
        <span>{{ item.name }}</span>
        <input class="taxInput">
      </div>
    </div>
    <div class="buttonBox" v-show="!isTaxMode">
      <div class="grid-item controller">AC</div>
      <div class="grid-item controller">Del</div>
      <div class="grid-item" @click="changeMode">Tax</div>
      <div class="grid-item operator">/</div>
      <div class="grid-item operator">(</div>
      <div class="grid-item operator">)</div>
      <div class="grid-item controller">Rand</div>
      <div class="grid-item controller">Dark</div>
      <div class="grid-item num">7</div>
      <div class="grid-item num">8</div>
      <div class="grid-item num">9</div>
      <div class="grid-item operator">*</div>
      <div class="grid-item num">4</div>
      <div class="grid-item num">5</div>
      <div class="grid-item num">6</div>
      <div class="grid-item operator">-</div>
      <div class="grid-item num">1</div>
      <div class="grid-item num">2</div>
      <div class="grid-item num">3</div>
      <div class="grid-item operator">+</div>
      <div class="grid-item operator">%</div>
      <div class="grid-item num">0</div>
      <div class="grid-item num">.</div>
      <div class="grid-item" id="getResult">=</div>
    </div>
  </div>
</template>