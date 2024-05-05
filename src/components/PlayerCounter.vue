<script setup>
import Button from './Button.vue'
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
		hstreak.value = offline.hstreak
	}
})

// TODO: Undo not working for highest streak

const hit = ref(0)
const total = ref(0)
const percentage = ref(0)
const history = ref("")
const streak = ref(0)
const hstreak = ref(0)

function goal() {
	hit.value++
	total.value++
	streak.value++
	if (streak.value > hstreak.value) {
		hstreak.value = streak.value
	}
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
	hstreak.value = 0
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
		streak: streak.value,
		hstreak: hstreak.value
	}
	localStorage.setItem('offline', JSON.stringify(offlineObj))
}

function setHighestStreak() {
	hstreak.value = prompt("What should the highest streak be:", hstreak.value)
	setOffline()
}
</script>

<template>
	<div class="px-10 pt-10 text-center">
		<span class="text-7xl">{{ percentage }}%</span>
		<div class="mt-10">
			<span class="text-4xl">{{ hit }}</span>
			<span class="text-4xl">/</span>
			<span class="text-4xl">{{ total }}</span>
		</div>
		<p class="mt-10 text-xl">Current Streak: {{ streak }}</p>
		<p class="mt-10 text-xl" @dblclick="setHighestStreak">Highest Streak: {{ hstreak }}</p>
	</div>
	<div class="p-10 m-auto max-w-80">
		<div class="grid grid-cols-2 gap-5">
			<Button @click="goal" class="flex items-center justify-center aspect-square">
				<PlusIcon class="w-6 h-6" />
			</Button>
			<Button @click="miss" class="flex items-center justify-center aspect-square">
				<MinusIcon class="w-6 h-6" />
			</Button>
			<Button @click="reset" class="flex items-center justify-center aspect-square">
				<ArrowPathIcon class="w-6 h-6" />
			</Button>
			<Button @click="undo" class="flex items-center justify-center aspect-square">
				<ArrowUturnLeftIcon class="w-6 h-6" />
			</Button>
		</div>
	</div>
</template>
