const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './assets/shop.png',
    scale: 2.75,
    framesMax: 6
})


const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 10
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: 
    {
        idle:
        {
            imageSrc: './assets/samuraiMack/Idle.png',
            framesMax: 8
        },
        run:
        {
            imageSrc: './assets/samuraiMack/Run.png',
            framesMax: 8
        },
        jump:
        {
            imageSrc: './assets/samuraiMack/Jump.png',
            framesMax: 2
        },
        fall:
        {
            imageSrc: './assets/samuraiMack/Fall.png',
            framesMax: 2
        },
        attack1:
        {
            imageSrc: './assets/samuraiMack/Attack1.png',
            framesMax: 6
        }
    }
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    player.update()
    //enemy.update()

    //initial speed
    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    
    if (keys.a.pressed && player.lastKey === 'a') 
    {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    //player currently in the air
    if (player.velocity.y < 0)
    {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) 
    {
        player.switchSprite('fall')
    }

    //enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft')
    {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight')
    {
        enemy.velocity.x = 5
    }

    //detect collision for player
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        })
        && player.isAttacking
    ) {
        player.isAttacking = false
        enemy.health -= 10
        document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    }
    //detect collision for enemy
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        })
        && enemy.isAttacking
    ) {
        enemy.isAttacking = false
        player.health -= 10
        document.querySelector('#playerHealth').style.width = player.health + '%'
    }

    //end game based on health
    if (enemy.health <= 0 || player.health <= 0)
    {
        determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    
    switch (event.key) 
    {
        case 'w' :
            player.velocity.y = -20
            break
        case 'a' :
            keys.a.pressed = true
            player.lastKey = 'a'
            break
        case 'd' :
            keys.d.pressed = true
            player.lastKey = 'd'
            break
        case ' ':
            player.attack()
            break
    }
    switch (event.key)
    {   
        case 'ArrowUp' :
            enemy.velocity.y = -20
            break
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = true
            enemy.lastKey = 'ArrowLeft'
            break
        case 'ArrowRight' :
            keys.ArrowRight.pressed = true
            enemy.lastKey = 'ArrowRight'
            break
        case 'ArrowDown' :
            //enemy.isAttacking = true
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) 
    {
        case 'a' :
            keys.a.pressed = false
            break
        case 'd' :
            keys.d.pressed = false
            break
    }
    switch (event.key)
    {   
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowRight' :
            keys.ArrowRight.pressed = false
            break
    }
})