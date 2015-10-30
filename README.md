# Infinite.js

```
// Infinite.js
$('.infinite-js').InfiniteJS({
    debug: true,
    limit: {
        start: 0,
        total: 10,
        items: 10,
    },
    repeat: {
        finish: 10,
        loadMore: 2,
        showLoadMore: true,
    },
    navSelector : '.infinite-container',
    nextSelector: '.infinite-container a:first',
    loadSelector: '#infinite-load',
});
```

```
<div class="infinite-container">
  <div id="infinite-load"></div>
</div>
```
