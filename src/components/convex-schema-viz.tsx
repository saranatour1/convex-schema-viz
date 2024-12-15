import { validatedSchemaObject } from "@/stores/schemaCode";
import {
    Background,
    BackgroundVariant,
    Controls,
    ReactFlow,
    useEdgesState,
    useNodesState
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useAtom } from "jotai";
import generateReactFlowData from "./hooks/generate-nodes-edges";
import { useEffect} from "react";
import { TableNode } from './table-node';


export const ConvexSchemaViz = () => {
  const [schemaValue,] = useAtom(validatedSchemaObject)
  
  const {nodes,edges} =  generateReactFlowData(schemaValue);

  const [nodesi, setNodes, _onNodesChange] = useNodesState(nodes);
  const [edgesi, setEdges, _onEdgesChange] = useEdgesState(edges);

  useEffect(()=>{
    const {nodes,edges} =  generateReactFlowData(schemaValue);
    setNodes(nodes)
    setEdges(edges)
  },[schemaValue])

  return (
    <div className="h-[calc(100dvh-2rem)] max-h-screen max-w-full w-full">
      <ReactFlow
        fitView
        fitViewOptions={{ padding: 0.4 }}
        defaultNodes={nodesi}
        defaultEdges={edgesi}
        nodes={nodesi}
        edges={edgesi}
        colorMode="dark"
          nodeTypes={{
            table: TableNode,
          }}
      >
        <Background color="#222" variant={BackgroundVariant.Lines} />
        <Controls />
      </ReactFlow>
    </div>
  );
};