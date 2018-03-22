const brain = require('brain.js');
const mimir = require('mimir');
const util =  require('./util');

// Huge shout out to Joe Minichino from https://medium.com/@tech_fort/classifying-text-with-neural-networks-and-mimir-in-javascript-94c9de20c0ac

module.exports = class TextNeuralNet {
    constructor() {
        this.neuralNetwork = new brain.NeuralNetwork();
        this.categories = [];
        this.trainingDictionary = { words: [], dict: [] };
    }

    // TODO: Store category order somewhere and handle it better so we can re-train less strictly
    // NOTE: Currently only supports re-training if you pass the exact same categories in the same order
    train(categorizedTexts) {
        this.categories = Object.keys(categorizedTexts);

        const newTrainingDictionary = mimir.dict(util.flattenObject(categorizedTexts));
        this.trainingDictionary.words = this.trainingDictionary.words.concat(newTrainingDictionary.words);
        this.trainingDictionary.dict = this.trainingDictionary.dict.concat(newTrainingDictionary.dict);

        const transformedCategorizedTexts = util.transformObject(categorizedTexts);
        const trainingData = Object.keys(transformedCategorizedTexts).map((text) => {
            return [mimir.bow(text, this.trainingDictionary), this.categories.indexOf(transformedCategorizedTexts[text])]
        });

        this.neuralNetwork.train(trainingData.map((pair) => {
            return {
                input: pair[0],
                output: util.vectorResult(pair[1], this.categories.length),
            };
        }));
    }

    run(text) {
        const result = this.neuralNetwork.run(mimir.bow(text, this.trainingDictionary));
        return Object.assign(result.map((probability, index) => {
            return { [this.categories[index]]: Math.round(probability * 10000) / 100 }
        }));
    }
}