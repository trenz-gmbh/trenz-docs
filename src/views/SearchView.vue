<template>
	<ais-instant-search :search-client="client" index-name="files">
		<ais-search-box />
		<ais-hits>
			<template v-slot:item="{ item }">
				<router-link :to="'/wiki/' + item.location">{{ item.name }}</router-link>
			</template>
		</ais-hits>
	</ais-instant-search>
</template>

<script lang="ts">
import {Options, Vue} from 'vue-class-component';
import {instantMeiliSearch} from '@meilisearch/instant-meilisearch';

@Options({
})
export default class HomeView extends Vue {
	client = instantMeiliSearch(
		"http://localhost:7700/",
		"masterKey"
	);
}
</script>
