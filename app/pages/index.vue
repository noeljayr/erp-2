<script lang="ts" setup>
import IconWalletClosed from '~/components/svg/IconWalletClosed.vue';
import IconGithub from '~/components/svg/IconGithub.vue';
import IconUsers from '~/components/svg/IconUsers.vue';
import IconArrowUpRight from '~/components/svg/IconArrowUpRight.vue';

definePageMeta({
  layout: 'landing-page',
});

const routes = [
  {
    name: 'Finances',
    description: 'Automate finance management',
    link: '/finances',
  },
  {
    name: 'Projects',
    description: 'Visualize and track Bintel’s progects',
    link: '/projects',
  },
  {
    name: 'Team',
    description: 'Manage employees',
    link: '#',
  },
];
</script>

<template>
  <div
    class="relative w-screen h-screen flex flex-col items-center justify-center"
  >
    <NuxtImg src="/bintel.png" class="w-20 max-sm:w-[10vw] max-[400px]:w-[5rem]" />

    <div class="grid grid-cols-3 cursor-pointer gap-2 w-[50%] max-[1208px]:w-[65%] max-[925px]:w-[75%] max-[802px]:w-[90%] my-8">
      <NuxtLink
        :href="route.link"
        v-for="route in routes"
        style="transition: var(--transition)"
        class="p-2 flex flex-col border border-[rgba(44,_44,_53,_0.05)] hover:brightness-[99%] space-y-2 rounded-[var(--radius)] bg-[#FCFCFC]"
      >
        <div class="flex">
          <span
            class="h-7 w-7 flex items-center justify-center rounded-[var(--radius-s)] bg-[#F2F2F2]"
          >
            <IconWalletClosed
              class="h-4 w-4"
              :stroke-width="2"
              v-if="route.name === 'Finances'"
            />
            <IconGithub
              class="h-4 w-4"
              :stroke-width="2"
              v-if="route.name === 'Projects'"
            />
            <IconUsers
              class="h-4 w-4"
              :stroke-width="2"
              v-if="route.name === 'Team'"
            />
          </span>

          <span
            class="h-4 w-4 ml-auto rounded-full flex justify-center items-center bg-[var(--black)]"
          >
            <IconArrowUpRight class="h-3 w-3" stroke="2" color="var(--white)" />
          </span>
        </div>

        <div class="flex flex-col">
          <span>{{ route.name }}</span>
          <p class="font-p3 opacity-65 max-[668px]:hidden">{{ route.description }}</p>
        </div>
      </NuxtLink>
    </div>

    <div class="other-links flex gap-6 max-[420px]:gap-2 mt-4">
      <NuxtLink
        class="flex gap-2 font-semibold"
        href="http://Bintel.gitbook.io"
        target="_blank"
        rel="noopener noreferrer"
      >
        <NuxtImg src="/icons/gitbook.png" />
        <span class="opacity-85"> Gitbook </span>
      </NuxtLink>

      <NuxtLink
        class="flex gap-2 font-semibold"
        href="#"
        target="_blank"
        rel="noopener noreferrer"
      >
        <NuxtImg src="/icons/google-drive.png" />
        <span class="opacity-85"> Google drive </span>
      </NuxtLink>

      <NuxtLink
        class="flex n8n gap-2 font-semibold"
        href="https://n8n.bintelanalytics.mw/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <NuxtImg src="/icons/n8n.png" />
        <span class="opacity-85"> n8n </span>
      </NuxtLink>

     
    </div>
    <div class="links"></div>
  </div>
</template>

<style scoped>
.other-links a {
  padding: 0.35rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 2rem;
  border: 1px solid rgba(61, 68, 77, 0.08);
  align-items: center;
  transition: var(--transition);
  background-color: white;
}


.other-links a:hover{
  filter: brightness(96%);
}

.other-links a * {
  font-size: var(--p3);
}

.other-links img {
  width: fit-content;
  height: 1rem;
  opacity: 0.75;
}

.other-links .n8n img {
  opacity: 1;
}


</style>
