import os from 'node:os'
import chalk from 'chalk'

function monitor(){
    const oldCpus = os.cpus()

    setTimeout(()=>{
        const newCpus = os.cpus()
        const usage = newCpus.map((cpu, i)=>{
            return {
                core: i,
                usage: getCpuUsage(oldCpus[i], newCpus[i])+ '%'
            }
        })
        console.clear()
        console.log(chalk.bgMagenta("======== CPU Usage ========"))
        console.table(usage)

        const totalMemory = os.totalmem() / (1024 * 1024 * 1024); // in GB
        const memoryUsed = (os.totalmem() - os.freemem()) / (1024 * 1024 * 1024); // in GB
        
        console.log(chalk.bgCyan("====== Memory Usage ======"));

        console.log(
            'Memory Used:', memoryUsed>5 ? 
            chalk.redBright(`${memoryUsed.toFixed(2)} / ${totalMemory.toFixed(2)} GB`) :
            chalk.greenBright(`${memoryUsed.toFixed(2)} / ${totalMemory.toFixed(2)} GB`)
        );
        
    }, 1000)
}

function getCpuUsage(oldCpu, newCpu){
    const oldTotal = Object.values(oldCpu.times).reduce((acc, time)=> acc + time, 0);
    const newTotal = Object.values(newCpu.times).reduce((acc, time)=> acc + time, 0);
    const idleDiff = newCpu.times.idle - oldCpu.times.idle;
    const totalDiff = newTotal - oldTotal;
    const usagePercentage = ((totalDiff - idleDiff) / totalDiff) * 100;
    return usagePercentage.toFixed(1);
}

setInterval(monitor, 1000);

//   {
//     model: 'Intel(R) Core(TM) i5-1035G1 CPU @ 1.00GHz',
//     speed: 1190,
//     times: {
//       user: 3539359,
//       nice: 0,
//       sys: 1000515,
//       idle: 317476859,
//       irq: 26421
//     }
//   }