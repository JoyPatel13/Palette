import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    try{
        const newUser = await prisma.user.create({
            data:{
                email:"demo@gmail.com",
                name:"Demo",
                color_vector: [0.5, 0.2, 0.1, 0, 0, 0.2],
            }
        })
        const newGame = await prisma.game.create({
            data:{
                rawgId: 12345,
              title: "Super Fake Game",
              slug: "super-fake-game",
              description: "A very fake game for testing.",
              coverImageUrl: "https://example.com/image.jpg",
              tag_vector: [0.9, 0.1, 0, 0, 0, 0],
              genres: ["Action"],
              tags: ["Shooter"]
            }
        })
        console.log("User and game created successfully:");
        console.log(newUser);
        console.log(newGame);

    }catch(err){
       console.log(err)
    }
    
}

main().finally(()=>prisma.$disconnect());
