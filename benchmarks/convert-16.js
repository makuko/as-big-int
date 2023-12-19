import benchmark from 'benchmark';
import assert from 'assert';
import BN from 'bn.js';

import { convert16 } from '../build/benchmark.js';



const strings = [
    '1c7f668fe09b6020cf6b92ff1a55fd7d67e6281d5d65cdbe4f526f8494c31722946353befae82d8190a5dc5',
    '12d01ab4fb469275a8ee040a6862c457c996f07b62a834d2a25d6b9e8634ca45d3f5924913a3460a887d7e70d',
    'c6b61a179e196afac8520aadee9339df414a4c174210adf0d2fac0ba698d98818ed1d923df6c93cf41ad878795',
    '832e3739975ec79f8e3e290cd27f3134621a0c3b5a9d02d3fb47893b0fae79ad87488858ae7ead93d25b8e78815d',
    '5699827504ed91c854e7091976f5f77b94c332132ed1a6ddf0e23997fd5a2e538e4ee2028b31a09695de710d8d6665',
    '392b571f4040d53d400c8501cf8860609534dc0ea9e86728840558055640889528f21333ade3c30368efd8a1f25898ad',
    '25bd9c83a16accc56f4843ce3201079fc27fe545ae2a6c19bf27871b85f09a2a7807cead1dcb5bbd40465602e8fc7cca35',
    '18ea2c52e58f812e5676b4c31f02ae0877666e5afffa015cff3118312b6bd5c6093d277048ab3f8fef6e6ec7ebceae617cfd',
    '10729742b98bbc4797145d54cf78c4e396d29eda12fc0ae6647768f875aa301fbc195f091ff90cf6050fe721faab711e5b8305',
    'adba5db0c7d3f4b42bc719cfcf6b9fa3e910addf68863321852d44c05ad59c4f32cbfbd061b698e69577f956e7b2dad0a697e4d',
    '72b007d9b3eaec8af0e6700a2fee0c6334dc02c87c0097c120eae262fbf704304888a93c90818af038ac339a5ef51273bdfa460d5',
    '4bb6352eb7c61627b9081ff6b9a4262d7de53dd659dc642e7ebb0f73585611c3dfe237b8fb6584b89569ae10e8afc92e686a383ec9d',
    '1fb491bd751c4a039265d19e08d5d34081c55d281527e22b1a97d332550d1ba4ecc56c91df6049ddaa2c3e9299c0bcfa2ee1f21733a5',
    '20fee3436124facdc5ba5376153d5287595ab4a7f75f7544e748e3a6c3a25a73fe04e54ac4c7690c35557354ec7803cc128f328d15117ed',
    '15c844077b216991d7880118f4057b7b59fce142e24e046a7caf1e4917262db692b13b5e5be7a4590f356923101b3a81b840885f22e88cb75',
    'e6134e8f0490eb14748c8b979179e846e67f0b5276580ea4c4f9afe4048342d86d700314aabeb7ecb0a426825a1f99fa2a29a06ce0b84e503d',
    '97e2bedc6a03ab3080f0c8270f097a56ce29de79702021aac608d51d86faa720e03ef208a4b7e76b409c5d6c0d7edca625d57ae7e059abb2f845',
    '6444afff81fc6c03051ef421c8ed41c34e19a3de2b053639bcbbd4b07e1b7854b4098dc7b4bd67c5cda739ac54e8bfa9aef9ee23131b325925e58d',
    '4231582faccfa34dfe616f2a4da4a069ee8eed2daa6670cc1d97ff688340226feada4e98d651098194c36512c40da6870482fe35279cf43cda048a15',
    '2bb29337791512ce7cee5262ed41ade5ee7c5a93257da076bf89579bfea556bbe20a1de2e57b7f468b34fdb9636d02ef21fa79d117269d3c2becff27dd',
    '1cd8e32f9eeee96a507954634ea05bccca7017cb23bfeeee6471aad5fb1b26420838adbac97e870591e5fb7f62a2f6efdd6e5a6b08487dccb8ff747150e5',
    '130b2dfa6febb8172f2018b58ee7dc9a31a3ffb51a99b4bb604f09c742c4ec41976d6ab04f048722ad50d307181d9504592dd9b0a877db0c2620a3dece672d',
    'c92615a53e29c874e1c304fdb5710a1cac543ce8e8f784fb2942d748b13fff74cf73b6e6429fd35e46a5b4faeeb875fdedf44b59f371f9b052b8c2e16421cb5',
    '84ca244a160995552909be4b7cc79facedc39c35c1cb66c9ce3d201efd033fa41cf363be01fb82893ca36479a797c5e4a21645be61b63dd5669bf8a6cb1a4f37d',
    '57a971f4e88c539538176e9fd55fc86928f6221f7cef46db39265a3475072503571cacd86f4f092c9907dd544fa331a3ef00b40aae814ed1e0bcf7261c145e4bd85',
    '39dedc3aad84a32d8207780783dc3b4d6c0a7c86c979f5c6b8ba518ca141b76f3481ee1ae17b2d0e7106311ca892bbc538c776db0d335d088d5cbf282889724011ccd',
    '26341f62bc8c8fb90ad6ee3cf60c63261c52ec34fb0183402ff2ffd5d674621869a9c62fbeda50be889d166beb48ddf5327bad769bb6e86aa5523a3182c2bc6c4bc0355',
    '193868b82e78cae12827e3463e6e2d7428b2bdeef9b3ffa55fa76ae42a92d4c21dc113d584fe1f4dc82fb3cd3e531a86de53a5834ccbbf6e6723486aaf528e637e01e331d',
    '10a63d2196adbdeea38255095f36bc01aeddff62c2d7d3c42c258590a01aee7425a47617f4cbc2aa59277db27e24dc8308c53843adb2815fe2164ace6dbd7fffae2f3efbe25',
    'afdbe5b2c78b26289f10a232fdb221d1c708d9832a07acc8124c52c79b1c76aacd991f5d09a838274db11fad546559280ca3224adaad7684c40b7624672197fc9fd30944866d'
];



// BigInt

function convert16BigInt() {
    for (let i = 0; i < strings.length; i++) {
        const x = BigInt('0x' + strings[i]);

        assert(x.toString(16) === strings[i], 'wrong conversion');
    }
}



// BN.js

function convert16BN() {
    for (let i = 0; i < strings.length; i++) {
        const x = new BN(strings[i], 16);

        assert(x.toString(16) === strings[i], 'wrong conversion');
    }
}



// Suite

const suite = new benchmark.Suite('Convert hexadecimal');

suite
    .add('own', () => {
        convert16();
    })
    .add('bigint', () => {
        convert16BigInt();
    })
    .add('bn.js', () => {
        convert16BN();
    })
    .on('cycle', event => {
        console.log(String(event.target));
    })
    .on('complete', () => {
        console.log('Fastest is ' + suite.filter('fastest').map('name'));
    })
    .on('error', event => {
        console.error(event.target.error);
    })
    .run();
