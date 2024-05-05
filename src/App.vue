<script setup>
import Button from './components/Button.vue'
import { ref } from 'vue'
import { onMounted } from 'vue'

import PlayerCounter from './components/PlayerCounter.vue'
import MultipleCounter from './components/MultipleCounter.vue'

onMounted(() => {
	let playerItem = localStorage.getItem('player')
	if (playerItem)
		player.value =  (playerItem === 'true')
})

const player = ref(true)

function setPlayer(bool) {
	player.value = bool
	localStorage.setItem('player', player.value)
}
</script>

<template>
	<div class="mx-auto mt-5">
		<div class="block">
			<nav class="flex justify-center p-4 space-x-4">
				<button :class="{'bg-gray-900 text-white': player}" class="p-2 border-2 border-gray-900 rounded" @click="setPlayer(true)">1 Player</button>
				<button :class="{'bg-gray-900 text-white': !player}" class="p-2 border-2 border-gray-900 rounded" @click="setPlayer(false)">Multiple</button>
			</nav>
		</div>
	</div>
	<div id="player" v-if="player">
		<PlayerCounter />
	</div>
	<div id="game" v-else>
		<MultipleCounter />
	</div>
</template>
