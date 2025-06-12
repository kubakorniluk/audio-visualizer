<script setup>
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
    import { 
        faMusic, 
        faHeart, 
        faMinus, 
        faAsterisk, 
        faTablets
    } from '@fortawesome/free-solid-svg-icons';
    import { 
        faGithub, 
        faLinkedin, 
        faSoundcloud, 
        faYoutube
    } from '@fortawesome/free-brands-svg-icons'
    import { library } from '@fortawesome/fontawesome-svg-core'; 
    
    library.add(
        faMusic, 
        faHeart, 
        faGithub, 
        faYoutube,
        faLinkedin, 
        faMinus,
        faAsterisk,
        faTablets
    );
</script>

<template>
    <nav class="navbar">
        <div class="title">
                <h1 class="title__text">
                    Music by <a href="https://www.youtube.com/@blurryhorse" target="_blank">@blurryhorse</a> <FontAwesomeIcon :icon="faMinus" /> enjoy              
                </h1>
        </div> 
        <div class="social">
            <a href="https://www.youtube.com/@blurryhorse" target="_blank">
                <FontAwesomeIcon class="social__icon social__icon--1" :icon="faYoutube" />
            </a>
            <a href="https://github.com/kubakorniluk" target="_blank">
                <FontAwesomeIcon class="social__icon social__icon--2" :icon="faGithub" />
            </a>
            <a href="https://www.linkedin.com/in/kuba-korniluk/" target="_blank">
                <FontAwesomeIcon class="social__icon social__icon--3" :icon="faLinkedin" />
            </a>
        </div>
    </nav>
</template>

<style scoped>
    .navbar {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 3rem;
        background-color: var(--black-300);
        .title {
            display: flex;
            flex-direction: column;
            gap: .5rem;
            a {
                margin: 0;
                padding: 0;
                color: var(--purple);
                font-style: normal;                
            }
            .title__footer {
                    display: flex;
                    align-items: center;    
                    gap: .5rem;
                    word-spacing: .15rem;
                    margin: 0;
                    padding: 0;
                    font: var(--p-600-09);
                    color: var(--slategray);
                    font-size: 0.8rem;
                    /* font-style: italic; */
                
                .title__footer--icon {
                    color: var(--slategray);
                    font-size: 1rem;
                    /* transform: rotate(-45deg); */
                }
            }
            .title__text {
                margin: 0;
                padding: 0;
                font: var(--p-600-12);
                color: var(--white);
                word-spacing: .15rem;
            }
        }
        .social {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            gap: 0rem;
            margin: 0;
            padding: 0;    
            .social__icon {
                color: var(--white);
                font-size: 1.2rem;
                padding: 1rem;
                transition: 0.3s;
            }
            .social__icon--1 {
                border-top-left-radius: 8px;
                border-bottom-left-radius: 8px;
            }
            .social__icon--3 {
                border-top-right-radius: 8px;
                border-bottom-right-radius: 8px;
            }
            .social__icon:hover {
                cursor: pointer;
                background-color: var(--dark-blue-150);
                box-shadow: 0px 0px 20px var(--dark-blue-600) inset;
            }
        }
    }
</style>