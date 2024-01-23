<script setup>
import Button from './components/Button.vue'
import { PlusIcon, MinusIcon, ArrowPathIcon, ArrowUturnLeftIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const hit = ref(0)
const total = ref(0)
const percentage = ref(0)
const history = ref("")

function goal() {
	hit.value++
	total.value++
	history.value = history.value.concat("+")
	percentageCalc()
}

function miss() {
	total.value++
	history.value = history.value.concat("-")
	percentageCalc()
}
function percentageCalc() {
	console.log(hit.value / total.value)
	percentage.value = ((hit.value / total.value) * 100).toFixed(2).replace(/[.,]00$/, "");
	console.log(history.value)
}
function undo() {
	let action = history.value.slice(-1)
	history.value = history.value.slice(0, -1)
	if (action == '+') {
		hit.value--
		total.value--
	} else {
		total.value--
	}
	percentageCalc()
}
function reset() {
	hit.value = 0
	total.value = 0
	percentage.value = 0
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
</div></template>
