import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding pledges...')
  
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(5);

  const pledges = [
    { slug: 'reusable-bottle',  name: 'Carry a Reusable Bottle',       category: 'environment', impactMetric: 'bottles_saved',   impactPerUnit: 30  },
    { slug: 'wooden-earbuds',   name: 'Switch to Wooden Earbuds',      category: 'lifestyle',   impactMetric: 'plastic_grams',    impactPerUnit: 50  },
    { slug: 'walk-10k-steps',   name: 'Walk 10,000 Steps Today',       category: 'health',      impactMetric: 'calories_burned',  impactPerUnit: 400, eventDate: nextMonth },
    { slug: 'no-plastic',       name: 'Reduce Single-Use Plastic',     category: 'environment', impactMetric: 'plastic_avoided',  impactPerUnit: 10  },
    { slug: 'meatless-monday',  name: 'Go Meatless on Mondays',        category: 'health',      impactMetric: 'co2_kg_saved',     impactPerUnit: 2.5 },
    { slug: 'plant-one-tree',   name: 'Plant One Tree This Month',     category: 'environment', impactMetric: 'trees_planted',    impactPerUnit: 1   },
    { slug: 'public-transport', name: 'Use Public Transport This Week', category: 'environment', impactMetric: 'co2_kg_saved',     impactPerUnit: 5   },
    { slug: 'support-local',    name: 'Support a Local Vendor Today',  category: 'social',      impactMetric: 'local_supported',  impactPerUnit: 1   },
    { slug: 'sustainable-pkg',  name: 'Use Sustainable Packaging',     category: 'environment', impactMetric: 'plastic_avoided',  impactPerUnit: 15  },
    { slug: 'read-30-min',      name: 'Read for 30 Minutes Daily',     category: 'lifestyle',   impactMetric: 'reading_hours',    impactPerUnit: 0.5 },
  ]

  for (const p of pledges) {
    const pledge = await prisma.pledge.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        description: `Commit to ${p.name.toLowerCase()} and make a tangible difference in the world.`,
        category: p.category,
        bgImageUrl: `/images/pledges/${p.slug}.png`,
        impactMetric: p.impactMetric,
        impactPerUnit: p.impactPerUnit,
        eventDate: p.eventDate || null,
        isFeatured: Math.random() > 0.6,
      }
    })

    const count = await prisma.pledgeCommitment.count({ where: { pledgeId: pledge.id } });
    if (count === 0) {
      for (let i = 1; i <= 10; i++) {
        await prisma.pledgeCommitment.create({
          data: {
            pledgeId: pledge.id,
            text: `I will keep commitment #${i} for the ${pledge.name} pledge.`,
            order: i
          }
        })
      }
    }
  }

  console.log('Seeding quizzes...')

  const quizzes = [
    { slug: 'ocean-basics', title: 'Ocean Conservation Basics', category: 'environment' },
    { slug: 'sustainable-101', title: 'Sustainable Living 101', category: 'lifestyle' },
    { slug: 'mental-wellness', title: 'Mental Wellness Check', category: 'health' },
  ]

  for (const q of quizzes) {
    const quiz = await prisma.quiz.upsert({
      where: { slug: q.slug },
      update: {},
      create: {
        slug: q.slug,
        title: q.title,
        description: `Test your knowledge on ${q.title.toLowerCase()} and earn your certificate!`,
        category: q.category,
        bgImageUrl: `/images/quizzes/${q.slug}.png`,
        isFeatured: true
      }
    })

    const count = await prisma.question.count({ where: { quizId: quiz.id } });
    if (count === 0) {
      for (let i = 1; i <= 4; i++) {
        const question = await prisma.question.create({
          data: {
            quizId: quiz.id,
            text: `Sample question ${i} about ${quiz.title}?`,
            order: i
          }
        })

        for (let j = 1; j <= 4; j++) {
          await prisma.answerOption.create({
            data: {
              questionId: question.id,
              text: `Option ${j} for Question ${i}`,
              isCorrect: j === 1,
              order: j
            }
          })
        }
      }
    }
  }
  
  console.log('Seeding complete!')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
