import { parse } from 'csv-parse'
import fs from 'node:fs'

const csvPath = new URL('./tasks.csv', import.meta.url)

const stream = fs.createReadStream(csvPath)

const parser = parse({
    delimiter: ',',
    skip_empty_lines: true,
    from_line: 2,
});

(async () => {
    const lines = stream.pipe(parser)

    for await (const line of lines) {
        const [title, description] = line

        await fetch('http://localhost:3333/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, description })
            })

        console.log(`Task "${title}" created`)
    }
})();