//@ts-check

class Neuron {
    constructor(id) {
        this.id = id;
    }
}

class Connection {
    constructor(weight,bias) {
        this.weight = weight;
        this.bias = bias;
    }

    output(input) {
        return this.weight * input + this.bias;
    }
}

class NeuralNetwork {
    constructor(inputsAmount,hiddenAmount,outputAmount) {
        this.idCounter = 0;
        this.inputs = this.generateNeuronArray(inputsAmount);
        this.hiddens = this.generateNeuronArray(hiddenAmount);
        this.outputs = this.generateNeuronArray(outputAmount);


        this.connectionsInpToHid = this.generateConnections(this.inputs,this.hiddens);
    }

    generateNeuronArray(amount) {
        let array = [];
        for(let i = 0; i < amount; i++) {
            array.push(new Neuron(this.idCounter))
            this.idCounter++
        }
        return array;
    }

    generateConnections() {

    }
}