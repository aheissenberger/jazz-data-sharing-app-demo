import { startWorker } from 'jazz-nodejs';
import { parseArgs } from 'node:util';
import { Issue, Project } from "../schema.ts";
import { faker } from '@faker-js/faker';
import { type ID } from 'jazz-tools';

/*
jazz-tools account create -n worker --json false
*/

if (process.env.JAZZ_WORKER_ACCOUNT === undefined) {
    console.error("JAZZ_WORKER_ACCOUNT is required");
    process.exit(1);
}
if (process.env.JAZZ_WORKER_SECRET === undefined) {
    console.error("JAZZ_WORKER_SECRET is required");
    process.exit(1);
}
const { /* worker,*/ done } = await startWorker({
    syncServer: 'wss://cloud.jazz.tools/?key=you@example.com',
});

const args = parseArgs({
    options: {
        'project-id': { type: 'string', required: true },
        'delete': { type: 'boolean', default: false },
        'title': { type: 'string' },
        'faker': { type: 'boolean', default: true },
        'count': { type: 'string', default: '1' }
    }
});

const projectId = args.values['project-id'] as ID<Project>;
const title = args.values['title'];
const count = parseInt(args.values['count']);

console.log(`Project ID: ${projectId}, Count: ${count}`);

if (projectId === undefined) {
    console.error("Project ID is required");
    process.exit(1);
}

const project = await Project.load(projectId, {
    resolve: {
        issues: { $each: true }
    }
});
if (!project) { throw new Error("Project not found or not accessible"); }

if (args.values['delete']) {
    console.log(`Deleting issues for project "${project.name}"`);
    await project.issues.waitForSync();
    let countDelete = 0;
    try {
        while (true) {
            project.issues.pop();
            countDelete++;
        }
    } catch (e) {
        console.log(e)
    }
    await project.issues.waitForSync();
    console.log(`${countDelete} issues deleted`);
    await done();
    process.exit(0);
}

for (let index = 0; index < count; index++) {
    project?.issues.push(Issue.create({
        title: title ?? faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        estimate: faker.number.int({ min: 1, max: 100 }),
        status: faker.helpers.arrayElement(["backlog", "in progress", "done"]),
    }, project._owner));
}
console.log(`Created ${count} issues for project "${project.name}"`);
await project.issues.waitForSync();
console.log(`Issues synced`);
await done();