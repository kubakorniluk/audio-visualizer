<script setup>

</script>
<template>
    <div class="load-more">
        <button class="load-more__button">
            Load more
        </button>
    </div>
</template>
<style scoped>
    .load-more {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem 0;
        .load-more__button {
            background-color: var(--purple-300);
            color: var(--white);
            font: var(--p-600-09);
            padding: 1rem 2rem;
            border: 1px solid var(--purple);
            cursor: pointer;
            transition: box-shadow 0.3s ease;
        }
        .load-more__button:hover {
            box-shadow: 0px 0px 45px var(--dark-purple) inset;

        }
    }
</style>