import { BigInt } from './big-int';
import { bigInt } from '.';

const _Gaz = BigInt.fromString('25925201511471244808909080173171693503203792369882740963446734898884002523813104800367669756166522152575362640568909073840472363732523772357238956623590923956238523554551871888350939347335213210001838328277865758589024604469058963070851547738667825645961804564421445229');
const _Zil = BigInt.fromString('253057943210559710436372687529332696597');

export function catalan(n: i32): void {
    let x = bigInt(1);

    for (let i = 2; i <= n; i++) {
        x.mulInt(i);
    }

    let y = x.copy();

    for (let i = n + 1; i <= n * 2; i++) {
        y.mulInt(i);
    }

    x.mul(x).mulInt(n + 1);
    y.div(x);

    // console.log(y.toString());

    // throw new Error('End here');
}

export function factorial(n: i32): void {
    let x = BigInt.fromInt(n);

    while (--n !== 0) {
        x.mulInt(n);
    }

    // console.log(x.toString());

    // throw new Error('End here');
}

export function fibonacci(n: i32): void {
    let x = BigInt.fromInt(1);
    let y = BigInt.fromInt(1);
    let z = BigInt.fromInt(0);

    while(--n){
        z.add(x, y);
        y.assign(x);
        x.assign(z);
    }

    // console.log(y.toString());

    // throw new Error('End here');
}

export function multiply(n: i32): void {
    let x = BigInt.fromInt(3);
    let y = BigInt.fromInt(7);
    let z = BigInt.fromInt(0);

    for (let i = 0; i <= n; i++) {
        z.mul(y, x);
        x.mulInt(13);
        y.mulInt(13);
    }

    // console.log(z.toString(16));

    // throw new Error('End here');
}

export function shift(n: i32): void {
    const x = BigInt.fromInt(7)

    for (let i = n; i > 0; i--) {
        if (i % 2) {
            x.shr(i * 10);
        } else {
            x.shl(i * 10);
        }
    }

    // console.log(x.toString());

    // throw new Error('End here');
}

export function divide(): void {
    const x = _Gaz.copy();
    const y = _Zil.copy();

    while (!x.isZero) {
        // console.log('---');
        // console.log(x.toString());
        // console.log(y.toString());
        x.div(y);
        y.divInt(733);
    }

    // console.log(y.toString());

    // throw new Error('End here');
}

const strings: string[] = [
    '63827481287523340933156458354634124244309616758167630842551007819073339395044662984225156970322839887301',
    '10786844337591444617703441461933166997288325232130329612391120321423394357762548044334051527984559940953869',
    '1822976693052954140391881607066705222541726964230025704494099334320553646461870619492454708229390630021203861',
    '308083061125949249726227991594273182609551856954874344059502787500173566252056134694224845690767016473583452509',
    '52066037330285423203732530579432167861014263825373764146055971087529332696597486763323998921739625784035603474021',
    '8799160308818236521430797667924036368511410586488166140683459113792457225724975263001755817773996757502016987109549',
    '1487058092190281972121804805879162146278428389116500077775504590230925271147520819447296733203805452017840870821513781',
    '251312817580157653288585012193578402721054397760688513144060275749026370823931018486593147911443121391015107168835828989',
    '42471866171046643405770867060714750059858193221556358721346186601585456669244342124234241997033887515081553111533255099141',
    '7177745382906882735575276533260792760116034654443024623907505535667942177102293818995586897498726990048782475849120111754829',
    '1213038969711263182312221734121073976459609856600871161440368435527882227930287655410254185677284861318244238418501298886566101',
    '205003585881203477810765473066461502021674065765547226283422265604212096520218613764332957379461141562783276292726719511829671069',
    '34645606013923387750019364948231993841662917114377481241898362887111844311916945726172269797128932924110373693470815597499214410661',
    '5855107416353052529753272676251206959241032992329794329880823327921901688713963827723113595714789664174653154196567835977367235401709',
    '989513153363665877528303082286453976111734575703735241749859142418801385392659886885206197675799453245516383059219964280175062782888821',
    '167227722918459533302283220906410721962883143293931255855726195068777434131359520883599847407210107598492268737008173963349585610308210749',
    '28261485173219661128085864333183412011727251216674382239617726966623386368199759029328374211818508184145193416554381399806079968142087616581',
    '4776190994274122730646511072307996629981905455617970598495395857359352296225759275956495241797327883120537687397690456567227514616012807202189',
    '807176278032326741479260371220051430466942021999437031145721899893730538062153317636647695863748412247370869170209687159861449970106164417169941',
    '136412790987463219309995002736188691748913201717904858263627001082040460932503910680593460600973481669805676889765437130016585044947941786501720029',
    '23053761676881284063389155462415888905566331090325921046552963182864837897593160905020294841564518402197159394370358874972802872596202161918790684901',
    '3896085723392937006712767273148285225040709954265080656867450777904157604693244192948429828224403609971319937648590649870403685468758165364275625748269',
    '658438487253406354134457669162060203031879982270798631010599181465802635193158268608284640969924210085153069462611819828098222844220129946562580751457461',
    '111276104345825673848723346088388174312387717003764968640791261667720645347643747394800104323917191504390868739181397550948599660673201960969076146996310909',
    '18805661634444538880434245488937601458793524173636279700293723221844789063751793309721217630742005364242056816921656186110313342653771131403773868842376543621',
    '3178156816221127070793387487630454646536105585344531269349639224491769351774053069342885779595398906556907602059759895452642954908487321207237783834361635871949',
    '537108501941370474964082485409546835264601843923225784520089028939109020449814968718947696751622415208117384748099422331496659379534357284023185468007116462359381',
    '90771336828091610268929940034213415159717711623025157583895045890709424456018729713502160751024188170171838022428802374022935435141306380999918344093202682138735389',
    '15340355923947482135449159865782067161992293264291251631678262755529892733067165321581865166923087800759040625790467601209876088538880778388986200151751253281446280741',
    '2592520151147124480890908017317169350376697561665221525753626405684551871888350939347335213210001838328277865758589024604469058963070851547738667825645961804564421445229'
];

export function convert10(): void {
    for (let i = 0; i < strings.length; i++) {
        const x = BigInt.fromString(strings[i], 10);

        assert(x.toString(10) === strings[i], 'wrong conversion');
    }
}

const hexStrings: string[] = [
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

export function convert16(): void {
    for (let i = 0; i < strings.length; i++) {
        const x = BigInt.fromString(hexStrings[i], 16);

        assert(x.toString(16) === hexStrings[i], 'wrong conversion');
    }
}
