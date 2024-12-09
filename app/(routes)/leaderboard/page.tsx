'use client'
import { Card } from '../../../components/ui/card';
import { ScrollArea } from '../../../components/ui/scroll-area';
import { LiveEmoji } from 'liveemoji'
import React from 'react'
import { FaAward } from 'react-icons/fa';

const tasks = [
  { "border": "border-2", "id": 1, "rank": "🥇", "username": "imGet", "reward": "84,597,773 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 2, "rank": "🥈", "username": "Pishnahad_Sup", "reward": "60,105,774 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 3, "rank": "🥉", "username": "Esalat", "reward": "52,155,586 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 4, "rank": "#4", "username": "mehranseydi", "reward": "50,696,750 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 5, "rank": "#5", "username": "abbas", "reward": "46,196,284 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 6, "rank": "#6", "username": "Dimker77", "reward": "37,235,160 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 7, "rank": "#7", "username": "ladesov", "reward": "34,876,302 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 8, "rank": "#8", "username": "CenterProd", "reward": "34,588,476 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 9, "rank": "#9", "username": "xaffizmedia", "reward": "32,921,791 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 10, "rank": "#10", "username": "tuxeoqt", "reward": "31,681,983 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 11, "rank": "#11", "username": "Roboland_Support", "reward": "28,889,012 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 12, "rank": "#12", "username": "TrungAnh9999", "reward": "26,574,736 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 13, "rank": "#13", "username": "s0meone_u_know", "reward": "23,998,299 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 14, "rank": "#14", "username": "putinhuylo_v_gaage", "reward": "23,133,944 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 15, "rank": "#15", "username": "Mehran_087", "reward": "22,829,594 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 16, "rank": "#16", "username": "SlavaSemenchuk", "reward": "21,544,260 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 17, "rank": "#17", "username": "flasher888", "reward": "21,420,971 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 18, "rank": "#18", "username": "Skulkandy", "reward": "21,400,032 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 19, "rank": "#19", "username": "Dokievero", "reward": "20,893,727 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 20, "rank": "#20", "username": "danyaqp", "reward": "20,224,079 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 21, "rank": "#21", "username": "allinrekt", "reward": "20,046,984 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 22, "rank": "#22", "username": "LeviAckermmann", "reward": "19,870,256 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 23, "rank": "#23", "username": "Shahrrraam", "reward": "18,653,664 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 24, "rank": "#24", "username": "GraphMessengerDev", "reward": "18,025,887 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 25, "rank": "#25", "username": "crptanec", "reward": "16,988,964 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 26, "rank": "#26", "username": "itwogd", "reward": "16,843,833 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 27, "rank": "#27", "username": "Anonym", "reward": "16,019,946 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 28, "rank": "#28", "username": "Btc_mans", "reward": "15,571,981 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 29, "rank": "#29", "username": "jimsotter", "reward": "15,209,522 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 30, "rank": "#30", "username": "yesDave", "reward": "15,094,533 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 31, "rank": "#31", "username": "Im_mmd_ho3in", "reward": "15,041,008 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 32, "rank": "#32", "username": "elkanadi", "reward": "14,662,294 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 33, "rank": "#33", "username": "Sharad_121", "reward": "14,236,408 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 34, "rank": "#34", "username": "AlirezaQPC", "reward": "14,071,506 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 35, "rank": "#35", "username": "moohsen", "reward": "13,730,423 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 36, "rank": "#36", "username": "AbTiN_AK47", "reward": "13,509,271 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 37, "rank": "#37", "username": "Sadjatt", "reward": "13,236,246 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 38, "rank": "#38", "username": "Mirniyozov_Samandar", "reward": "12,801,000 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 39, "rank": "#39", "username": "Broken_ThomasShelby", "reward": "12,685,088 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 40, "rank": "#40", "username": "investeduard", "reward": "12,522,981 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 41, "rank": "#41", "username": "amiir_roman", "reward": "12,226,464 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 42, "rank": "#42", "username": "MaMaL", "reward": "11,789,598 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 43, "rank": "#43", "username": "faraz_mandaa", "reward": "11,622,096 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 44, "rank": "#44", "username": "Q700k", "reward": "11,577,665 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 45, "rank": "#45", "username": "alexmvp", "reward": "11,554,986 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 46, "rank": "#46", "username": "mamad0901", "reward": "11,532,007 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 47, "rank": "#47", "username": "mambik", "reward": "11,298,085 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 48, "rank": "#48", "username": "dnevnikutra", "reward": "11,156,680 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 49, "rank": "#49", "username": "ahlawyEG", "reward": "10,881,532 PERKS", "bottom": "border-b-[1px]" },
  { "border": "border-2", "id": 50, "rank": "#50", "username": "TelegaMAT", "reward": "10,825,309 PERKS" }
]
  ;
const Leader = () => {

  const getBackgroundClass = (rank: string) => {
    switch (rank) {
      case "🥇":
        return "bg-[#ffec451a]";
      case "🥈":
        return "bg-[#c7c7c71a]";
      case "🥉":
        return "bg-[#ffa2451a]";
      default:
        return "";
    }
  };

  return (
    <div className='flex flex-col'>
      <div className='flex-1 flex flex-col items-center'>
        <LiveEmoji icon="Trophy" size={"5rem"} className='no-interaction' />
        <p className='p-2 font-bold text-2xl'>Leaderboard</p>
        <main className='text-sm w-full flex justify-between items-center p-2 bg-muted-foreground/10 rounded-xl'>
          <p>Total</p>
          <p>35,518,571 users</p>
        </main>
        <div className='w-full shine-effect mt-2 bg-foreground/5 rounded-xl'>
                    <div className={`pr-2`}>
                        <div className="p-4 py-2  flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`rounded-xl p-3 border-foreground bg-black`}
                                >
                                    <FaAward />
                                </div>
                                <div>
                                    <h3 className=" text-base font-semibold">PERKS USER</h3>
                                    <p className="">XXX PERKS</p>
                                </div>
                            </div>
                            <div className="text-right ">
                                #51,541
                            </div>
                        </div>
                    </div>
                </div>
        <Card className='w-full mt-2'>
          <ScrollArea className='rounded-xl overflow-hidden w-full bg-muted-foreground/10 h-[50dvh]'>
            {tasks.map((task) => (
              <div key={task.id} className={`pr-2 border-gray-500/30 ${task.bottom} ${getBackgroundClass(task.rank)}`}>
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`rounded-[.3rem] p-2 border-foreground bg-white ${task.border}`}
                    >
                      <FaAward fill='black' />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">{task.username}</h3>
                      <p className="text-muted-foreground text-sm">{task.reward}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {task.rank}
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </Card>
      </div>
    </div>
  )
}

export default Leader