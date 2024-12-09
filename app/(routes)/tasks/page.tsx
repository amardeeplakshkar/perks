/* eslint-disable @next/next/no-img-element */
'use client'

import Heading from "../../../components/Heading"
import TaskCard from "../../../components/TaskCard"
import {
    Card,
} from "../../../components/ui/card"
import { ScrollArea } from "../../../components/ui/scroll-area"
import { Separator } from "../../../components/ui/separator"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../../components/ui/tabs"
import { useRouter } from "next/navigation"


export default function Tasks() {
    const router = useRouter();
    const taskData = {
        limited: [
            {
                id: "L07f1f77bcf86cd799439001",
                icon: "ton",
                title: "Ton Promote",
                reward: 100000,
                bg: 'bg-blue-500',
                bottom: 'border-b-2',
                img: true,
            },
            {
                id: "L07f1f77bcf86cd799439002",
                icon: <span className="scale-125 h-[25px] w-[25px] flex justify-center items-center">😳</span>,
                title: "Mystery Quest",
                reward: 1000000,
                status: "0/1",
                bg: "bg-foreground/10",
            },
        ],
        InGame: [
            { id: "G07f1f77bcf86cd799439001", icon: "amardeep04", title: "Complete Profile", reward: 5000, status: "0/1" },
            { id: "G07f1f77bcf86cd799439002", icon: "github", title: "Verify Email", reward: 3000, status: "1/1", onClick: () => router.push('/') },
            { id: "G07f1f77bcf86cd799439003", icon: "gitlab", title: "Join Telegram", reward: 2000, status: "calculating" },
            { id: "G07f1f77bcf86cd799439004", icon: "bitbucket", title: "Follow on Twitter", reward: 4000, status: "0/1" },
        ],
        partner: [
            {
                id: "P07f1f77bcf86cd799439214",
                icon: "blum",
                title: "Join Blum Channel",
                reward: 1000,
                path: "https://t.me/blumcrypto",
                img: true,
            },
            {
                id: "P07f1f77bcf86cd799439215",
                icon: "cats",
                title: "Join Cats Channel",
                reward: 1000,
                path: "https://t.me/blumcrypto",
                img: true,
            },
            {
                id: "P07f1f77bcf86cd799439216",
                icon: "xempire",
                title: "Join XEmpire Channel",
                reward: 1000,
                path: "https://t.me/blumcrypto",
                img: true,
            },
            {
                id: "P07f1f77bcf86cd799439217",
                icon: "paws",
                title: "Join Paws Channel",
                reward: 1000,
                path: "https://t.me/blumcrypto",
                img: true,
            },
            {
                id: "P07f1f77bcf86cd799439218",
                icon: "tomarket",
                title: "Join tomarket Channel",
                reward: 1000,
                path: "https://t.me/blumcrypto",
                img: true,
            },
        ]
    }

    const completedTasks = {
        "L07f1f77bcf86cd799439001": true,
        "P07f1f77bcf86cd799439217": true,
    };

    return(
    <>
    <Heading title="tasks" desc={`for completing  task`}/>
        <Tabs defaultValue="limited" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-foreground/10">
                <TabsTrigger className="capitalize" value="limited">limited</TabsTrigger>
                <TabsTrigger className="capitalize" value="ingame">in-game</TabsTrigger>
                <TabsTrigger className="capitalize" value="partner">Partner</TabsTrigger>
            </TabsList>
            <TabsContent value="limited">
                <Card>
                    <ScrollArea className="h-[50dvh]">
                        {taskData.limited.map((task, index) => (
                            <div key={task.id || index}>
                                <TaskCard task={task} completedTasks={completedTasks} />
                                {index !== taskData.limited.length - 1 && <Separator />}
                            </div>
                        ))}
                    </ScrollArea>
                </Card>
            </TabsContent>
            <TabsContent value="partner">
                <Card>
                    <ScrollArea className="h-[50dvh]">
                        {taskData.partner.map((task, index) => (
                            <div key={task.id || index}>
                                <TaskCard task={task} completedTasks={completedTasks} />
                                {index !== taskData.partner.length - 1 && <Separator />}
                            </div>
                        ))}
                    </ScrollArea>
                </Card>
            </TabsContent>
            <TabsContent value="ingame">
                <Card>
                    <ScrollArea className="h-[50dvh]">
                        {taskData.InGame.map((task, index) => (
                            <div key={task.id || index}>
                                <TaskCard task={task} completedTasks={completedTasks} />
                                {index !== taskData.InGame.length - 1 && <Separator />}
                            </div>
                        ))}
                    </ScrollArea>
                </Card>
            </TabsContent>
        </Tabs>
        </>
    )
}