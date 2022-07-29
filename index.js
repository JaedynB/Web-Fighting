const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)
const gravity = 0.7

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

function rectangularCollision({rectangle1,rectangle2})
{
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({player, enemy, timerId})
{
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health)
        {
            document.querySelector('#displayText').innerHTML = 'Tie'

        } else if (player.health > enemy.health)
        {
            document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
        } else if (enemy.health > player.health)
        {
            document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
        }
}

let timer = 60
let timerId
function decreaseTimer()
{
    
    if (timer > 0)
    {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }
    if (timer === 0)
    {
        determineWinner({player, enemy, timerId})
    }
}
decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    //initial speed
    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
    if (keys.a.pressed && player.lastKey === 'a') 
    {
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5
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