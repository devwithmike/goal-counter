<script setup>
import Button from './Button.vue'
import { PlusIcon, MinusIcon, ArrowPathIcon, ArrowUturnLeftIcon, ExclamationTriangleIcon, ShareIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { convertToBinary, convertFromBinary } from '../utils/history.js'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useRouter, useRoute } from 'vue-router'

const queryParams = ref({})
const open = ref(false)
const router = useRouter()
const route = useRoute()

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
		currentStreak.value = offline.currentStreak
	}

	const urlParams = new URLSearchParams(window.location.search);
	urlParams.forEach((value, key) => {
		queryParams.value[key] = value;
	});

	if (queryParams.value.g && queryParams.value.t && queryParams.value.h && queryParams.value.s && queryParams.value.hs && queryParams.value.cs) {
		open.value = true
	}
})

const hit = ref(0)
const total = ref(0)
const percentage = ref(0)
const history = ref("")
const streak = ref(0)
const hstreak = ref(0)
const currentStreak = ref(false)

function goal() {
	hit.value++
	total.value++
	streak.value++
	if (streak.value > hstreak.value) {
		hstreak.value = streak.value
		if (!currentStreak.value) {
			currentStreak.value = true
		}
	}
	history.value = history.value.concat("+")
	percentageCalc()
	setOffline()
}

function miss() {
	streak.value = 0
	total.value++
	history.value = history.value.concat("-")
	if (currentStreak.value) {
		currentStreak.value = false
	}
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
	if (currentStreak.value && hstreak.value != 0) {
		hstreak.value--
	}
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
		hstreak: hstreak.value,
		currentStreak: currentStreak.value
	}
	localStorage.setItem('offline', JSON.stringify(offlineObj))
}

function overrideScore() {
	hit.value = queryParams.value.g
	total.value = queryParams.value.t
	percentageCalc()
	history.value = convertFromBinary(queryParams.value.h)
	streak.value = queryParams.value.s
	hstreak.value = queryParams.value.hs
	currentStreak.value = queryParams.value.cs
	open.value = false
	setOffline()
	router.replace({ path: route.path })
}

function cancelOverrideScore() {
	open.value = false
	router.replace({ path: route.path })
}

async function share() {
	try {
		let cs = currentStreak.value ? 1 : 0
		await navigator.share({
			title: 'Goal Counter',
			text: 'Here is my current score. Have a look.',
			url: `${window.location.href}?g=${hit.value}&t=${total.value}&h=${convertToBinary(history.value)}&s=${streak.value}&hs=${hstreak.value}&cs=${cs}`
		})
	} catch (err) {
		alert("There was a problem sharing. Please try again.")
	}
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
		<p class="mt-10 text-xl">Highest Streak: {{ hstreak }}</p>
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
			<Button @click="share" class="flex items-center justify-center col-span-2 gap-5 py-3">
				<ShareIcon class="w-6 h-6" />
				<p>Share Score</p>
			</Button>
		</div>
	</div>

	<TransitionRoot as="template" :show="open">
		<Dialog class="relative z-10" @close="open = false">
			<TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
				leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 transition-opacity bg-gray-500/75" />
			</TransitionChild>

			<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
				<div class="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
					<TransitionChild as="template" enter="ease-out duration-300"
						enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
						leave-from="opacity-100 translate-y-0 sm:scale-100"
						leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
						<DialogPanel
							class="relative px-4 pt-5 pb-4 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
							<div class="sm:flex sm:items-start">
								<div
									class="flex items-center justify-center mx-auto bg-red-100 rounded-full size-12 shrink-0 sm:mx-0 sm:size-10">
									<ExclamationTriangleIcon class="text-red-600 size-6" aria-hidden="true" />
								</div>
								<div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
									<DialogTitle as="h3" class="text-base font-semibold text-gray-900">Override Score
									</DialogTitle>
									<div class="mt-2">
										<p class="text-sm text-gray-500">You are about to override your existing score
											with the shared score. Would you like to proceed?</p>
									</div>
								</div>
							</div>
							<div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
								<button type="button"
									class="inline-flex justify-center w-full px-3 py-2 text-sm font-semibold text-white bg-red-600 rounded-md shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
									@click="overrideScore">Override</button>
								<button type="button"
									class="inline-flex justify-center w-full px-3 py-2 mt-3 text-sm font-semibold text-gray-900 bg-white rounded-md shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
									@click="open = false" ref="cancelButtonRef">Cancel</button>
							</div>
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>
