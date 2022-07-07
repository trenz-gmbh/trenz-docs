<template>
	<ais-instant-search :search-client="client" index-name="files">
		<ais-search-box />
		<ais-hits>
			<template v-slot:item="{ item }">
				<a :href="'/wiki/' + item.location">{{ item.name }}</a>
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
		"http://logging.trenz.cloud:7700/",
		"s3cr3t!K3y"
	);
}
</script>
