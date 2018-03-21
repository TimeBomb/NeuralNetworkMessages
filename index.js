const brain = require('brain.js');
const mimir = require('mimir');

// Huge shout out to Joe Minichino from https://medium.com/@tech_fort/classifying-text-with-neural-networks-and-mimir-in-javascript-94c9de20c0ac

const vectorResult = (res, numClasses) => {
    let i = 0;
    const vec = [];
    for (i; i < numClasses; i++) {
       vec.push(0);
    }
    vec[res] = 1;
    return vec;
}

const maxarg = (array) => {
    return array.indexOf(Math.max.apply(Math, array));
};

const categories = {
    GIBBERISH: 0,
    ENGLISH: 1,
};

const trainingMessages = {
    GIBBERISH: [
        'dfbijdf odfg nosfdg ',
        'pgbmso lbfjlngfbjdnfgj kldfgbklfgbn',
        'rogijjoeigj ergpmer kmdvbkldsmbdf',
        'sdfgofsdnjgj jlndfsgnjksdfg nje4rtkjnertjkner',
        'fdb dfbjmklsdfnb sdnsw ifhasduif',
        ' idfpjgsaiod OIJDFSIOAG dfelgksafdg',
    ],
    ENGLISH: [
        'I am 12 what is this',
        'Hello world.',
        'Hi there how are you',
        'Some day I will rule the world',
        'I love food',
        'Want to go over there, or over here?',
    ],
};

const trainingTexts = mimir.dict(trainingMessages.GIBBERISH.concat(trainingMessages.ENGLISH));

const trainingData = [];
trainingMessages.GIBBERISH.forEach((gibberishMsg) => {
    trainingData.push([mimir.bow(gibberishMsg, trainingTexts), categories.GIBBERISH]);
});
trainingMessages.ENGLISH.forEach((englishMsg) => {
    trainingData.push([mimir.bow(englishMsg, trainingTexts), categories.ENGLISH]);
});

const neuralNetwork = new brain.NeuralNetwork();
neuralNetwork.train(trainingData.map((pair) => {
    return {
        input: pair[0],
        output: vectorResult(pair[1], 3),
    };
}));


const resultEnglish = maxarg(neuralNetwork.run(mimir.bow('Some random crap here do you know what I mean', trainingTexts)));
console.log('Passing english msg, result is:', Object.keys(categories)[resultEnglish]); // ENGLISH

const resultGibberish = maxarg(neuralNetwork.run(mimir.bow('awsfasdgf asdfa d 321432jlnssjksdf njsd', trainingTexts)));
console.log('Passing gibberish msg:', Object.keys(categories)[resultGibberish]); // GIBBERISH