<!-- index.vue -->
<template lang="">
    <div>
        <button @click="cal('mainThread')">Sum 0 to {{ numToSum }} (Main thread)</button>
        <button @click="cal('workerPublic')">Sum 0 to {{ numToSum }} (Worker Public)</button>
        <button @click="cal('workerVite')">Sum 0 to {{ numToSum }} (Worker Vite)</button>
        <div v-for="(val, index) in countingMsg">{{val}}</div>
        <div class="css_animated_part"></div>
    </div>
</template>
<script  setup >
// import worker script according to the doc of Vite
import MyWorker from '@/assets/workers/workerVite?worker'
const numToSum = ref(1000000000)
const countingMsg = ref([])


const cal = async (type) => {
    let sum = 0;
    const start = performance.now();
    if (type === 'mainThread') {
        sum = await sumNumMainMainThread()
    } else if (type === 'workerPublic') {
        sum = await sumNumWorkerPublic()
    } else if (type === 'workerVite') {
        sum = await sumNumWorkerVite()
    }
    const end = performance.now();
    countingMsg.value.push(`The sum of 0 to ${numToSum.value} is  ${sum} (${type})  (time spent: ${end - start} ms)`)
}

// calculate answer on main thread
const sumNumMainMainThread = () => {
    return new Promise((resolve, reject) => {
        console.log('In main thread: calculating sum to ' + numToSum.value)
        let sum = 0;
        for (let i = 1; i <= numToSum.value; i++) {
            sum += i;
        }
        console.log('In main thread: ' + 'The sum of 0 to ' + numToSum.value + ' is ' + sum)
        resolve(sum)
    })

}


// calculate the answer with web worker create from /public/worker.js
const sumNumWorkerPublic = () => {
    return new Promise((resolve, reject) => {
        const worker = new Worker('/worker.js')
        worker.postMessage(numToSum.value);
        worker.addEventListener('message', (e) => {
            if (e.data) {
                resolve(e.data)
                worker.terminate()
            }
        }, false);
    })
}

// calculate the answer with web worker create from /assets/workers/worker.js
const sumNumWorkerVite = () => {
    return new Promise((resolve, reject) => {
        const worker = new MyWorker()
        worker.postMessage(numToSum.value);
        worker.addEventListener('message', (e) => {
            if (e.data) {
                resolve(e.data)
                worker.terminate()
            }
        }, false);
    })
}

</script>
<style lang="css">
.css_animated_part {
    width: 100px;
    height: 100px;
    position: relative;
    background-color: red;
    animation-name: example;
    animation-duration: 4s;
    animation-iteration-count: infinite;
}

@keyframes example {
    0% {
        background-color: red;
        left: 0px;
        top: 0px;
    }

    25% {
        background-color: yellow;
        left: 200px;
        top: 0px;
    }

    50% {
        background-color: blue;
        left: 200px;
        top: 200px;
    }

    75% {
        background-color: green;
        left: 0px;
        top: 200px;
    }

    100% {
        background-color: red;
        left: 0px;
        top: 0px;
    }
}
</style>