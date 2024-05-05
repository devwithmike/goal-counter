<script setup>
import Button from './Button.vue'
import { PlusIcon, MinusIcon, ScaleIcon, ChartPieIcon, SparklesIcon, ArrowPathIcon, ArrowUturnLeftIcon  } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { onMounted } from 'vue'

onMounted(() => {
	let offlineObj = localStorage.getItem('offline-multi')
	if (offlineObj) {
		let offline = JSON.parse(offlineObj)
		players.value = offline.players
		sequence.value = offline.sequence
	}
})

const players = ref([])
const sequence = ref("")

function addPlayer() {
	let name = prompt("Please enter a player name:", '')
	if (name.length > 0) {
		players.value.push({
			name: name,
			hit: 0,
			total: 0,
			streak: 0,
			history: ""
		})
	}
	setOffline()
}

function editPlayerName(index) {
	let name = prompt("Please enter a player name:", players.value[index].name)
	if (name.length > 0) {
		players.value[index].name = name
	}
	setOffline()
}

function goal(index) {
	players.value[index].hit++
	players.value[index].total++
	players.value[index].streak++
	players.value[index].history = players.value[index].history.concat("+")
	sequence.value = sequence.value.concat(index)
	setOffline()
}

function miss(index) {
	players.value[index].streak = 0
	players.value[index].total++
	players.value[index].history = players.value[index].history.concat("-")
	sequence.value = sequence.value.concat(index)
	setOffline()
}

function reset() {
	players.value = []
	sequence.value = ""
	setOffline()
}

function undo() {
	let index = sequence.value.slice(-1)
	sequence.value = sequence.value.slice(0, -1)
	let action = players.value[index].history.slice(-1)
	players.value[index].history = players.value[index].history.slice(0, -1)
	if (action == '+') {
		players.value[index].hit--
		players.value[index].total--
	} else if (action == "-") {
		players.value[index].total--
	} else {}

	// RESET STREAK
	let tempHistory = players.value[index].history.split("").reverse().join("")
	let historyAction = tempHistory.slice(0, 1)
	if (historyAction == '+') {
		let missIndex = tempHistory.indexOf("-")
		let streakHistory = ""
		if (missIndex != -1) {
			streakHistory = tempHistory.substring(0, missIndex)
		} else {
			streakHistory = tempHistory
		}
		players.value[index].streak = streakHistory.length
	} else {
		players.value[index].streak = 0
	}
	setOffline()
}

function setOffline() {
	let offlineObj = {
		players: players.value,
		sequence: sequence.value
	}
	localStorage.setItem('offline-multi', JSON.stringify(offlineObj))
}
</script>

<template>
	<div class="mx-4">
		<div v-for="player, index in players" class="flex justify-between py-10 border-b-2">
			<div>
				<button @dblclick="editPlayerName(index)" class="text-lg font-medium">{{ player.name }}</button>
				<div class="flex justify-start gap-4 mt-3">
					<div class="flex items-center justify-center gap-2"><ScaleIcon class="w-6 h-6" />{{ player.hit }}/{{ player.total }}</div>
					<div class="flex items-center justify-center gap-2"><ChartPieIcon class="w-6 h-6" />{{ (((player.hit / player.total) * 100) || 0).toFixed(2).replace(/[.,]00$/, "") }}%</div>
					<div class="flex items-center justify-center gap-2"><SparklesIcon class="w-6 h-6" />{{ player.streak }}</div>
				</div>
			</div>
			<div class="flex items-center justify-center gap-2 ml-2">
				<Button class="flex items-center justify-center w-12 h-12 aspect-square" @click="miss(index)">
					<MinusIcon class="w-5 h-5" />
				</Button>
				<Button class="flex items-center justify-center w-12 h-12 aspect-square" @click="goal(index)">
					<PlusIcon class="w-5 h-5" />
				</Button>
			</div>
		</div>
		<div class="flex gap-5 mt-10">
			<Button class="flex justify-center w-full p-4" @click="reset">
				<ArrowPathIcon class="w-6 h-6" />
			</Button>
			<Button class="flex justify-center w-full p-4" @click="undo">
				<ArrowUturnLeftIcon class="w-6 h-6" />
			</Button>
		</div>
		<Button class="w-full p-4 mt-5" @click="addPlayer">
			Add Player
		</Button>
	</div>
</template>
