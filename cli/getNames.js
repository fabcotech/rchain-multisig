let names = [
    "Cecelia",
    "Israr",
    "Shola",
    "Isma",
    "Saima",
    "Jermaine",
    "Naeem",
    "Eoin",
    "Kymani",
    "Sumayyah",
    "Danyaal",
    "Armani",
    "Humza",
    "Isa",
    "Safiya",
    "Jeremiah",
    "Irving",
    "Sade",
    "Marlie",
    "Briony",
    "Haroon",
    "Sila",
    "Jagoda",
    "Ruby",
    "Dulcie",
    "Ewan",
    "Dania",
    "Larissa",
    "Samia",
    "Aasiyah",
    "Mohsin",
    "Bryony",
    "Tracey",
    "Maizie",
    "Paolo",
    "Edwin",
    "Aden",
    "Darren",
    "Lena",
    "Walid",
    "Suman",
    "Angelina",
    "Ryan",
    "Bessie",
    "Alessia",
    "Romy",
    "Leilani",
    "Patience",
    "Lisa",
    "Md",
    ].map(a => a.toLowerCase())


names = names.concat(names.map(n => `${n}0`))
names = names.concat(names.map(n => `${n}1`))
names = names.concat(names.map(n => `${n}2`))

module.exports.getNames = () => {
    console.log(names.length, 'names !!')
    return names;
}