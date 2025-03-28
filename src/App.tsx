import { useState } from "react"; 
import { Project, ListOfIssues } from "./schema";
import { ProjectComponent } from "./components/Project.tsx";
import { ID, Group } from "jazz-tools"
//import { useCoState } from "jazz-react";
function App() { 
    const [projectID, setProjectID] = useState<ID<Project> | undefined>(
        (window.location.search?.replace("?project=", "") || undefined) as ID<Project> | undefined
    );
    
    //const issue = useCoState(Issue, issueID); 
    
    const createProject = () => {
        const group = Group.create();
        group.addMember("everyone", "writer");
        const newProject = Project.create(
            {
                name: "New Project",
                issues: ListOfIssues.create([], { owner: group })
            },
            group,
        );
        setProjectID(newProject.id);
        window.history.pushState({}, "", `?project=${newProject.id}`);
    };
    
    if (projectID) {
        return <ProjectComponent projectID={projectID} />;
    } else {
        return <button onClick={createProject}>Create Project</button>;
    }
} 
export default App; 
