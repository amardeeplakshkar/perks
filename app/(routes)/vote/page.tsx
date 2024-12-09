import Heading from '../../../components/Heading'
import TaskCard from '../../../components/TaskCard'
import { Avatar, AvatarImage } from '../../../components/ui/avatar'
import { Card } from '../../../components/ui/card'
import { ScrollArea } from '../../../components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import React from 'react'

const page = () => {
    const completedTasks = {
        task1: true,
        "1": true,
    };

    return (
        <>
            <Heading title='vote' desc="for" desc2='voting projects' />
            <Tabs defaultValue='ongoing' className='w-full'>
                <TabsList className="grid w-full grid-cols-2 bg-foreground/10">
                    <TabsTrigger value='ongoing'>On Going</TabsTrigger>
                    <TabsTrigger value='completed'>Completed</TabsTrigger>
                </TabsList>
                <TabsContent value='ongoing'>
                    <Card className='min-h-[10rem] flex justify-center items-center flex-col'>
                        <Avatar className='h-24 w-24 rounded-none'>
                            <AvatarImage src='https://sticker-collection.com/stickers/animated/UtyaDuck/whatsapp/5c19cf2f-76ea-4644-bd37-d419bbaa8935file_2753189.webp' className=''/>
                        </Avatar>
                        <h2 className='font-semibold'>
                            No On-Going Voting 
                        </h2>
                    </Card>
                </TabsContent>
                <TabsContent value='completed'>
                    <Card>
                        <ScrollArea className=''>
                            <div className='bg-foreground/5 rounded-lg'>
                                <TaskCard
                                    completedTasks={completedTasks}
                                    task={{
                                        id: "1",
                                        icon: "tomarket",
                                        title: "Tomarket",
                                        reward: "Season 1 Winner",
                                        img: true,
                                    }} />
                            </div>
                        </ScrollArea>
                    </Card>
                </TabsContent>
            </Tabs >
        </>
    )
}

export default page