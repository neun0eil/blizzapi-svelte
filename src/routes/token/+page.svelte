<script>
	export let data;
	$: date = Date.now();
	$: passed = date - data.token.last_updated_timestamp;
	$: {
		console.log(data.token);
	}
</script>

<div id="token">
	Last Update: {data.token.last_updated_timestamp}<br />
	Now: {date}<br />
	Passed: {passed}<br />
	Token: {data.token.price}
</div>
