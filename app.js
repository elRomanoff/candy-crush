//GLOBAL DATA
const container = document.getElementById("container");
let deleted = false


//SOUND
const deleteAudio = new Audio("sonic.mp3")
const noDeleteAudio = new Audio("sonic2.mp3")

//////////////////DATA STRUCTURE LIST
class Node {
    constructor(value){
        this.value = value;
        this.value.setAttribute("draggable", true)
        this.next = null;
        // this.prev = null;
    }

    findAndErase() {

    }
}

class NodeList {
    constructor(height, cant){
        this.init()
        this.cant = cant;
        this.head = null;
        this.last = null;
        this.division = height/cant;
        this.max = height - this.division;
        this.candyColors = {
            "red": "hue-rotate(240deg) saturate(2.4) contrast(1.5)",
            "yellow": "hue-rotate(300deg) saturate(2) contrast(1.5)",
            "blue":"hue-rotate(90deg) brightness(.7) contrast(2)",
            "green":"brightness(.8)",
            "purple": "hue-rotate(160deg) brightness(.7) contrast(1.5)",
            "black": "invert() saturate(0)"
        }
        this.deleteList = []
    }
    //methods
    init(){
        const column = document.createElement("div");
        column.classList.add("column");
        this.column = column
        container.appendChild(this.column)
    }

    getLength() {
        if(this.last) return this.last.i + 1
        else return 0
    }

    getById(num){
        if (num == this.head.i) {
            return this.head;
        }

        else {
            let aux = this.head;
            if (aux) {
                while (aux.next) {
                    if (aux.next.i == num) {
                        return aux.next
                    } else {
                        aux = aux.next
                    }
                }
            }
        }
    }

    push(){


        const value = document.createElement("div");
        const image = document.createElement("img")

        const colorToUse = Object.keys(this.candyColors)[Math.floor(Math.random() * 6)]
        value.style.color = colorToUse

        image.style.filter = this.candyColors[colorToUse]

        image.setAttribute("src", "pink.png")
        value.appendChild(image)
        value.classList.add("column-item");

        value.addEventListener("dragstart", dragStart)
        value.addEventListener("dragend", dragEnd)
        value.addEventListener("dragover", dragOver)
        value.addEventListener("dragenter", dragEnter)
        value.addEventListener("dragleave", dragLeave)
        value.addEventListener("drop", dragDrop)

      
        
        this.column.appendChild(value)

        if(!this.head){
            this.head = new Node(value);

            setTimeout(()=>{
                this.head.value.style.top = (this.max + "px")
            },10)
           
            this.head.i = 0;
            this.last = this.head;
            
        }
        else{ 
            const node = new Node(value)
            this.last.next = node
            node.i = this.last.i + 1
            this.last = node

            setTimeout(()=>{
                node.value.style.top = (this.max - this.division * node.i) + "px"
            }, 10)
        }
    }
    deleteById(id, n){
        const findById = (num) =>{
            if (num == this.head.i) {
                return null;
            }
            
            else{
                let aux = this.head;
                if (aux) {
                    while(aux.next){
                        if(aux.next.i == num){
                            return aux
                        }else {
                            aux = aux.next
                        }
                    }
                }
            }
        }

        let firstNode = findById(id)

        let counter = 0;
        let aux2 = firstNode
        while (counter < n){
            if(aux2){
                aux2 = aux2.next;
            }
            else aux2 = this.head

            this.column.removeChild(aux2.value)
            counter++;
        }
        if(firstNode) {
            firstNode.next = aux2.next
            if (firstNode.next == null) this.last = firstNode
        }
        else this.head = aux2.next

    }
    deleteAllFromList(){
        this.deleteList.forEach(x =>{
            this.deleteById(...x)  
        })
        if(this.deleteList.length > 0) deleted = true
        this.deleteList.length = 0;
    }


    async reorder(){
        setTimeout(()=>{
            let aux;
            if (this.head) {
                aux = this.head;
                aux.i = 0;
            }
            else {
                this.push()
            }
            while (aux) {

                if (aux.next){
                     aux.next.i = aux.i + 1
                }

                aux.value.style.top = (this.max - this.division * aux.i) + "px"
                aux = aux.next
            }
            setTimeout(() => {
                while (this.last.i < this.cant - 1 || (this.column.children.length < this.cant)) {
                    this.push()
                }
            }, 300)
        },300)
 
       
    }
    checkVertically(){
        let aux = this.head
        let counter = 3

        //unintelligible algorithm. dont waste your time reading this crap
        // it just looks for elements to erase after a move is done

        while (aux) {
            let color = aux.value.style.color

            if(aux.next && color === aux.next.value.style.color){
                if(aux.next.next && aux.next.next.value.style.color === color){
                    
                    let aux2= aux.next.next.next;

                    function countSimilar(node){
                        if (node && node.value.style.color === color) {
                            counter++
                            if (node.next)
                                countSimilar(node.next)
                        }
                    }

                    countSimilar(aux2)
                

                    this.deleteList.push([aux.i, counter])
                    aux = aux.next.next
                }
                else aux = aux.next
            }
            aux = aux.next  
        }  
    }
    //dev method

}

const columnsArray = []


//init the game (duh(?))
function initGame(cant){
    for (let i = 0; i < cant; i++) {
        const column = new NodeList(cant * 70, cant)
        columnsArray.push(column)
        columnsArray[i].column.classList.add(i)
        for (let i = 0; i < cant; i++) {
            column.push()
        }
    }
    checkColumnsRepeated()
}
    

function checkColumnsRepeated() {
    checkAllColumns();

    setTimeout(() => {
        columnsArray.forEach(x => {
            x.deleteAllFromList()
            x.reorder()
        })
        
        if (deleted == true) {
        deleteAudio.play()

            setTimeout(() => {
                checkColumnsRepeated()
                deleted = false;
            }, 630)
        }
       
    
    }, 700)
    
}



initGame(7)


function checkAllColumns(){
    for (let i = 0; i < columnsArray.length; i++) {
        columnsArray[i].checkVertically()
        for(let j = 0; j < columnsArray.length; j++) {
            let counter = 1;
            
            function count(){
                if(columnsArray[j] &&
                columnsArray[j + counter] &&
                columnsArray[j + counter].column.children[i] && 
                columnsArray[j].column.children[i].style.color === columnsArray[j + counter].column.children[i].style.color){
                    counter++;
                    count()
                }
            }
            count()

            if(counter >= 3){

                for(let index = 0; index < counter; index++){
                    columnsArray[j + index].deleteList.push([i, 1])
                }
                j = j + counter - 1
            }
        }
        
    }
}

//checking individual rows 
const checkRow = (index) =>{

    for (let hi = 0; hi < columnsArray.length; hi++) {
        
        let counter = 1;

        function countSimilar() {
            if (columnsArray[hi] &&
                columnsArray[hi + 1] &&
                columnsArray[hi + 1].column.children[index] &&
                columnsArray[hi].column.children[index].style.color === columnsArray[hi + 1].column.children[index].style.color) {
                    hi++
                    counter++
                countSimilar()
            }
        }
        countSimilar()

        if (counter >= 3) {
            hi2 = hi - counter + 1
            for (let j = 0; j < counter; j++) {
                try{
                    columnsArray[hi2 + j].deleteList.push([index, 1])
                }
                catch{}
            }
            // hi = hi + counter - 1
        }
    }
}

//moves

let colorBeingDragged
let colorBeingReplaced

let filterBeingDragged
let filterBeingReplaced


let elementBeingDragged = {
    column: 0,
    index: 0,
    domElement: ""
}
let elementBeingReplaced = {
    column: 0,
    index: 0,
    domElement:""
}


function dragStart() {
    colorBeingDragged = this.style.color;
    elementBeingDragged.domElement = this
    filterBeingDragged = this.children[0].style.filter


    let distanceFromStart = parseInt(this.style.top.substring(0, this.style.top.length - 2))
    let elementIndex = distanceFromStart/-70 + 6
    elementBeingDragged.column = parseInt(this.parentNode.classList[1])
    elementBeingDragged.index = elementIndex
}
function dragEnter(e) { 
    e.preventDefault()
}
function dragLeave(e){
    e.preventDefault()      
}

function dragOver(e){
    e.preventDefault()    
}

function dragEnd() {
    
}
function dragDrop() {
    colorBeingReplaced = this.style.color;
    elementBeingReplaced.domElement = this;
    filterBeingReplaced = this.children[0].style.filter

    let distanceFromStart = parseInt(this.style.top.substring(0, this.style.top.length - 2))
    let elementIndex = distanceFromStart / -70 + 6
    elementBeingReplaced.column = parseInt(this.parentNode.classList[1])
    elementBeingReplaced.index = elementIndex


    if(validateMove(elementBeingDragged, elementBeingReplaced)){

        this.style.color = colorBeingDragged
        elementBeingDragged.domElement.style.color = colorBeingReplaced

        this.children[0].style.filter = filterBeingDragged
        elementBeingDragged.domElement.children[0].style.filter = filterBeingReplaced

        columnsArray[elementBeingDragged.column].checkVertically();
        if (elementBeingDragged.column != elementBeingReplaced.column) columnsArray[elementBeingReplaced.column].checkVertically();
        checkRow(elementBeingDragged.index);
        if(elementBeingDragged.index != elementBeingReplaced.index) checkRow(elementBeingReplaced.index);

        columnsArray.forEach(x => {
            if(x.deleteList[0]){
                x.deleteAllFromList()
                x.reorder()

            }
        })


        if (deleted == true) {

            deleteAudio.play()

            setTimeout(() => {
                checkColumnsRepeated()
                deleted = false;

            }, 630)
        }
        else{
            noDeleteAudio.play()
            elementBeingDragged.domElement.style.color = colorBeingDragged;
            elementBeingReplaced.domElement.style.color = colorBeingReplaced;
            elementBeingDragged.domElement.children[0].style.filter = filterBeingDragged
            elementBeingReplaced.domElement.children[0].style.filter = filterBeingReplaced
        }  

    }
    else noDeleteAudio.play()
}


const validateMove = (start, end) =>{
    //si es en la misma columna
    if(start.column == end.column){
        //si es uno para arriba o uno para abajo, el movimiento es valido
        if(end.index == start.index+1 || end.index == start.index - 1){
            return true
        }
        else return false
    }
    //si es en distinta columna, pero misma fila
    else{ 
        if(start.column + 1 == end.column || start.column -1 == end.column) {
            if(start.index == end.index) return true
            else return false
        }
        else return false
    }
}
