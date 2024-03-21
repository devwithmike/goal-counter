<script setup>
import Button from './components/Button.vue'
import { PlusIcon, MinusIcon, ArrowPathIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { onMounted } from 'vue'

onMounted(() => {
	let offlineObj = localStorage.getItem('offline')
	if (offlineObj) {
		let offline = JSON.parse(offlineObj)
		hit.value = offline.hit
		total.value = offline.total
		percentage.value = offline.percentage
		history.value = offline.history
		streak.value = offline.streak
	}

	let playerItem = localStorage.getItem('player')
	if (playerItem)
		player.value =  (playerItem === 'true')
})

const hit = ref(0)
const total = ref(0)
const percentage = ref(0)
const history = ref("")
const streak = ref(0)
const player = ref(true)

function goal() {
	hit.value++
	total.value++
	streak.value++
	history.value = history.value.concat("+")
	percentageCalc()
	setOffline()
}

function miss() {
	streak.value = 0
	total.value++
	history.value = history.value.concat("-")
	percentageCalc()
	setOffline()
}
function percentageCalc() {
	if (total.value > 0) {
		percentage.value = ((hit.value / total.value) * 100).toFixed(2).replace(/[.,]00$/, "");
	} else {
		percentage.value = 0
	}
}
function undo() {
	let action = history.value.slice(-1)
	history.value = history.value.slice(0, -1)
	if (action == '+') {
		hit.value--
		total.value--
	} else if (action == "-") {
		total.value--
	} else { }
	resetStreak()
	percentageCalc()
	setOffline()
}
function reset() {
	hit.value = 0
	total.value = 0
	percentage.value = 0
	history.value = ""
	streak.value = 0
	localStorage.removeItem('offline')
}

function resetStreak() {
	let temp = history.value.split("").reverse().join("")
	let action = temp.slice(0, 1)
	if (action == '+') {
		let missIndex = temp.indexOf("-")
		let streakHistory = ""
		if (missIndex != -1) {
			streakHistory = temp.substring(0, temp.indexOf("-"))
		} else {
			streakHistory = temp
		}
		streak.value = streakHistory.length
	} else {
		streak.value = 0
	}
}

function setOffline() {
	let offlineObj = {
		hit: hit.value,
		total: total.value,
		percentage: percentage.value,
		history: history.value,
		streak: streak.value
	}
	localStorage.setItem('offline', JSON.stringify(offlineObj))
}

function setPlayer(bool) {
	player.value = bool
	localStorage.setItem('player', player.value)
}
</script>

<template>
	<div class="mx-auto mt-5">
		<div class="block">
			<nav class="flex justify-center p-4 space-x-4">
				<button :class="{'bg-gray-900 text-white': player}" class="p-2 border-2 border-gray-900 rounded" @click="setPlayer(true)">Player</button>
				<button :class="{'bg-gray-900 text-white': !player}" class="p-2 border-2 border-gray-900 rounded" @click="setPlayer(false)">Game</button>
			</nav>
		</div>
	</div>
	<div id="player" v-if="player">
		<div class="px-10 pt-10 text-center">
			<span class="text-7xl">{{ percentage }}%</span>
			<div class="mt-10">
				<span class="text-4xl">{{ hit }}</span>
				<span class="text-4xl">/</span>
				<span class="text-4xl">{{ total }}</span>
			</div>
			<p class="mt-10 text-xl">Current Streak: {{ streak }}</p>
		</div>
		<div class="p-10 m-auto max-w-80">
			<div class="grid grid-cols-2 gap-5">
				<Button @click="goal">
					<PlusIcon class="w-6 h-6" />
				</Button>
				<Button @click="miss">
					<MinusIcon class="w-6 h-6" />
				</Button>
				<Button @click="reset">
					<ArrowPathIcon class="w-6 h-6" />
				</Button>
				<Button @click="undo">
					<ArrowUturnLeftIcon class="w-6 h-6" />
				</Button>
			</div>
		</div>
	</div>
	<div id="game" v-else>
		<div class="flex flex-col gap-2 px-10 pt-10 text-center">
			<div>
				<p class="text-4xl"><span contenteditable="true">Team 1</span>: 0</p>
				<div class="flex p-10 m-auto max-h-40 max-w-80">
					<Button class="w-full">
						<PlusIcon class="w-6 h-6" />
					</Button>
				</div>
			</div>
			<hr class="h-px mx-8 my-8 bg-gray-900 border-0">
			<div>
				<p class="text-4xl"><span contenteditable="true">Team 2</span>: 0</p>
				<div class="flex p-10 m-auto max-h-40 max-w-80">
					<Button class="w-full">
						<PlusIcon class="w-6 h-6" />
					</Button>
				</div>
			</div>
		</div>
		<div class="p-10 m-auto max-w-80">
			<div class="grid grid-cols-2 gap-5">
				<Button>
					<ArrowPathIcon class="w-6 h-6" />
				</Button>
				<Button>
					<ArrowUturnLeftIcon class="w-6 h-6" />
				</Button>
			</div>
		</div>
	</div>
</template>
