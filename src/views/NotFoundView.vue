<template>
  <v-alert
    type="error"
    variant="tonal"
    title="Not available"
  >
    <div>
      We can't find that page. This could be because:

      <ul>
        <li>
          The page doesn't exist.
        </li>
        <li>
          The page exists, but you don't have view permission for it.
        </li>
      </ul>
    </div>
    <v-divider class="my-4 bg-red-lighten-4"></v-divider>
    <div class="d-flex flex-row align-center justify-end">
      <v-btn
        class="mr-3"
        variant="outlined"
        @click="$router.back()"
      >
        Go back
      </v-btn>

      <v-btn
        variant="outlined"
        @click="$router.push('/')"
      >
        Go home
      </v-btn>
    </div>
  </v-alert>
</template>

<script lang="ts">
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'NotFoundView',

  params: {
    path: {
      type: String,
      required: false,
    }
  }
});
</script>
