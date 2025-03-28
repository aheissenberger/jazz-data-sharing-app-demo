import { ID } from "jazz-tools";
import { Project, Issue } from "../schema";
import { IssueComponent } from "./Issue.tsx";
import { useCoState } from "jazz-react";
export function ProjectComponent({ projectID }: { projectID: ID<Project> }) {
    //const project = useCoState(Project, projectID, { issues: [{}] });
    const project = useCoState(Project, projectID, {
        resolve: {
            issues: true
        }
    } 
    );
    const createAndAddIssue = () => {
        project?.issues?.push(Issue.create({
            title: "",
            description: "",
            estimate: 0,
            status: "backlog",
        }, project._owner));
    };
    return project ? (
        <div>
            <h1>{project.name} - {project?.issues?.length ?? 'unknown'} Items</h1>
            <div className="border-r border-b">
                {project?.issues?.map((issue,index) => (
                    issue && <IssueComponent key={issue.id} issue={issue} index={index} />
                ))}
                <button onClick={createAndAddIssue}>Create Issue</button>
            </div>
        </div>
    ) : (
        <div>Loading project...</div>
    );
}
