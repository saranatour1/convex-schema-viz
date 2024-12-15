import { Edge, Node } from '@xyflow/react';
import { SchemaDefinitionNew } from '@convex/utils';

export interface ReactFlowData {
  nodes: Node[];
  edges: Edge[];
}

export interface Field {
    name: string;
    type: string;
    hasReference?: boolean;
    referenceTable?: string;
}

export interface Table {
  name: string;
  fields: Field[];
  isReferenced?: boolean
  [key: string]: unknown;
}

function generateReactFlowData(schema: SchemaDefinitionNew): ReactFlowData {
    const nodes: Node<Table>[] = [];
  const edges: Edge[] = [];

  const nodeWidth = 300;
  const nodeHeight = 200;
  const horizontalSpacing = 50;
  const verticalSpacing = 50;
  const columns = 3;
  let x = 50;
  let y = 50;
  let col = 0;

  const tableNames = Object.keys(schema);
  const nodeXPositions: { [tableName: string]: number } = {};

    for (let i = 0; i < tableNames.length; i++) {
      const tableName = tableNames[i];
        nodeXPositions[tableName] = 50 + i*x;
    }


  for (const tableName in schema) {
      const fields = Object.entries(schema[tableName].fields).map(([fieldName, fieldType]) => {
          const hasReference = fieldType.startsWith("id[");
          const referenceTable = hasReference ? fieldType.slice(3, -1) : undefined;

          return {
            name: fieldName,
            type: fieldType,
            hasReference,
              referenceTable
            } as Field
      });

    const node: Node<Table> = {
        id: tableName,
        type: "table",
        data: {
            name: tableName,
            fields: fields,
            isReferenced: false
        },
      position: { x, y},
    };
    nodes.push(node);

      for (const field of fields) {
          if (field.hasReference && field.referenceTable) {
          if (nodeXPositions[field.referenceTable]) {
                edges.push({
                 id: `${tableName}-${field.referenceTable}`,
                  source: tableName,
                    target: field.referenceTable,
              type: "smoothstep",
            });
          }
        }
    }
    // organize
    col++;
    if(col >= columns) {
        col = 0;
        x = 50;
        y += nodeHeight + verticalSpacing;
    }
    else {
        x += nodeWidth + horizontalSpacing
    }
  }
    for (const edge of edges) {
        const targetNode = nodes.find(node => node.id === edge.target);
        if (targetNode) {
            targetNode.data.isReferenced = true;
        }
    }


    return { nodes, edges };
}

export default generateReactFlowData;