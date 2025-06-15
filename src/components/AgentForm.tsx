// "use client";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardFooter } from "@/components/ui/card";
// import { runAgent, RunAgentOutput } from "@/services/api";
// import { useAuth } from "@/contexts/auth-context";

// interface AgentFormProps {
//   agentId: string;
//   inputSchema: Record<string, any>;
// }

// export function AgentForm({ agentId, inputSchema }: AgentFormProps) {
//   const { user } = useAuth();
//   const [inputValues, setInputValues] = useState<Record<string, any>>({});

//   const userId = user?.id;
//   console.log("AgentForm userId:", userId);
//   console.log("AgentForm agentId:", agentId);
//   if (!userId) {
//     return (
//       <p className="text-red-600">You must be logged in to run an agent.</p>
//     );
//   }
//   const [input, setInput] = useState("");
//   const [output, setOutput] = useState<RunAgentOutput | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       // const result = await await runAgent(agentId, { text: input }, userId);
// const result = await runAgent(agentId, inputValues, userId);
//       setOutput(result);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "An error occurred");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <Card>
//         <CardContent className="pt-6">
//           {/* <Textarea
//             placeholder="Enter your input here..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             className="min-h-[100px]"
//             disabled={isLoading}
//           /> */}
//           {Object.entries(inputSchema.properties).map(([key, schema]) => (
//             <div key={key} className="mb-4">
//               <label className="block font-medium mb-1">{key}</label>
//               <input
//                 type={schema.type === "number" ? "number" : "text"}
//                 value={inputValues[key] || ""}
//                 onChange={(e) =>
//                   setInputValues({
//                     ...inputValues,
//                     [key]:
//                       schema.type === "number"
//                         ? Number(e.target.value)
//                         : e.target.value,
//                   })
//                 }
//                 className="w-full border px-3 py-2 rounded"
//               />
//             </div>
//           ))}

//           {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

//           {output && (
//             <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//               <h3 className="font-medium mb-2">Output:</h3>
//               <p className="whitespace-pre-wrap">
//                 {typeof output.output === "object"
//                   ? JSON.stringify(output.output, null, 2)
//                   : output.output}
//               </p>
//             </div>
//           )}

//           {/* {output && (
//   <div className="mt-4 bg-gray-50 p-4 rounded">
//     <h3 className="font-medium mb-2">Output:</h3>
//     <pre className="text-sm">
//       {JSON.stringify(output.output, null, 2)}
//     </pre>
//   </div>
// )} */}

//         </CardContent>

//         <CardFooter>
//           <Button type="submit" disabled={isLoading}>
//             {isLoading ? "Running..." : "Run Agent"}
//           </Button>
//         </CardFooter>
//       </Card>
//     </form>
//   );
// }

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { runAgent, RunAgentOutput } from "@/services/api";
import { useAuth } from "@/contexts/auth-context";

interface AgentFormProps {
  agentId: string;
  inputSchema: {
    properties: Record<string, any>;
  };
}

export function AgentForm({ agentId, inputSchema }: AgentFormProps) {
  const { user } = useAuth();
  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [output, setOutput] = useState<RunAgentOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.id;
  if (!userId) {
    return (
      <p className="text-red-600">You must be logged in to run an agent.</p>
    );
  }

  const handleChange = (key: string, value: any, type: string) => {
    let parsedValue = value;
    if (type === "number") {
      parsedValue = Number(value);
    } else if (type === "boolean") {
      parsedValue = value === "true";
    }
    setInputValues((prev) => ({ ...prev, [key]: parsedValue }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await runAgent(agentId, inputValues, userId);
      setOutput(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6 space-y-4">
          {Object.entries(inputSchema.properties).map(([key, schema]) => (
            <div key={key}>
              <label className="block font-medium mb-1">
                {key}{" "}
                {schema.description && (
                  <span className="text-sm text-gray-500">
                    ({schema.description})
                  </span>
                )}
              </label>

              {schema.type === "boolean" ? (
                <select
                  value={inputValues[key] ?? ""}
                  onChange={(e) => handleChange(key, e.target.value, "boolean")}
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="" disabled>
                    Select true/false
                  </option>
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              ) : (
                <input
                  type={schema.type === "number" ? "number" : "text"}
                  value={inputValues[key] ?? ""}
                  onChange={(e) =>
                    handleChange(key, e.target.value, schema.type)
                  }
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              )}
            </div>
          ))}

          {error && <p className="text-sm text-red-600">{error}</p>}

          {output && (
            <div className="p-4 bg-gray-50 rounded">
              <h3 className="font-medium mb-2">Output:</h3>
              <pre className="text-sm whitespace-pre-wrap">
                {typeof output.output === "object"
                  ? JSON.stringify(output.output, null, 2)
                  : output.output}
              </pre>
            </div>
          )}
        </CardContent>

        <CardFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Running..." : "Run Agent"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
