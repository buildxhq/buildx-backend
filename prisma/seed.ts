const { PrismaClient } = require('@prisma/client');
const { division01 } = require('./BuildX_Trade_Seed_Div01.js');
const { division02 } = require('./BuildX_Trade_Seed_Div02.js');
const { division03 } = require('./BuildX_Trade_Seed_Div03.js');
const { division04 } = require('./BuildX_Trade_Seed_Div04.js');
const { division05 } = require('./BuildX_Trade_Seed_Div05.js');
const { division06 } = require('./BuildX_Trade_Seed_Div06.js');
const { division07 } = require('./BuildX_Trade_Seed_Div07.js');
const { division08 } = require('./BuildX_Trade_Seed_Div08.js');
const { division09 } = require('./BuildX_Trade_Seed_Div09.js');
const { division10 } = require('./BuildX_Trade_Seed_Div10.js');
const { division11 } = require('./BuildX_Trade_Seed_Div11.js');
const { division12 } = require('./BuildX_Trade_Seed_Div12.js');
const { division13 } = require('./BuildX_Trade_Seed_Div13.js');
const { division14 } = require('./BuildX_Trade_Seed_Div14.js');
const { division21 } = require('./BuildX_Trade_Seed_Div21.js');
const { division22 } = require('./BuildX_Trade_Seed_Div22.js');
const { division23 } = require('./BuildX_Trade_Seed_Div23.js');
const { division25 } = require('./BuildX_Trade_Seed_Div25.js');
const { division26 } = require('./BuildX_Trade_Seed_Div26.js');
const { division27 } = require('./BuildX_Trade_Seed_Div27.js');
const { division28 } = require('./BuildX_Trade_Seed_Div28.js');
const { division31 } = require('./BuildX_Trade_Seed_Div31.js');
const { division32 } = require('./BuildX_Trade_Seed_Div32.js'); 
const { division33 } = require('./BuildX_Trade_Seed_Div33.js');
const { division34 } = require('./BuildX_Trade_Seed_Div34.js');
const { division35 } = require('./BuildX_Trade_Seed_Div35.js');
const { division40 } = require('./BuildX_Trade_Seed_Div40.js');
const { division41 } = require('./BuildX_Trade_Seed_Div41.js');
const { division42 } = require('./BuildX_Trade_Seed_Div42.js');
const { division43 } = require('./BuildX_Trade_Seed_Div43.js');
const { division44 } = require('./BuildX_Trade_Seed_Div44.js');
const { division45 } = require('./BuildX_Trade_Seed_Div45.js');
const { division46 } = require('./BuildX_Trade_Seed_Div46.js');
const { division48 } = require('./BuildX_Trade_Seed_Div48.js');

const prisma = new PrismaClient();

// 👇 Combine all imported divisions into 1 big list
const tradeList = [
  ...division01,
  ...division02,
  ...division03,
  ...division04,
  ...division05,
  ...division06,
  ...division07,
  ...division08,
  ...division09,
  ...division10,
  ...division11,
  ...division12,
  ...division13,
  ...division14,
  ...division21,
  ...division22,
  ...division23,
  ...division25,
  ...division26,
  ...division27,
  ...division28,
  ...division31,
  ...division32,
  ...division33,
  ...division34,
  ...division35,
  ...division40,
  ...division41,
  ...division42,
  ...division43,
  ...division44,
  ...division45,
  ...division46,
  ...division48,
];

async function main() {
  console.log('🌱 Seeding trade data...');

  for (const trade of tradeList) {
    await prisma.trade.upsert({
      where: { name: trade.name },
      update: {},
      create: trade,
    });
  }

  console.log(`✅ Seeded ${tradeList.length} trades successfully.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
