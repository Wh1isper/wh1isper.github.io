# pymupdf4llm-mcp: Enhancing LLM Agents with High-Quality PDF Context

## Introduction

In the rapidly evolving landscape of AI agents, providing high-quality context to Large Language Models (LLMs) is crucial for their effectiveness. One common challenge is extracting structured, usable content from PDF documents - a format that's ubiquitous in academic, business, and technical domains.

As the developer of [lightblue-ai](https://github.com/ai-zerolab/lightblue-ai), I found myself needing a reliable, LLM-friendly PDF parsing tool that could preserve both textual content and the spatial relationships of elements like images. After evaluating various options, pymupdf4llm emerged as the standout solution, offering complete textual extraction and accurate image placement.

This led to the creation of [pymupdf4llm-mcp](https://github.com/pymupdf/pymupdf4llm-mcp), a Model Context Protocol (MCP) server that makes this powerful PDF parsing capability easily accessible to LLM agents.

## What is pymupdf4llm-mcp?

[pymupdf4llm-mcp](https://github.com/pymupdf/pymupdf4llm-mcp) is an MCP server that wraps the functionality of pymupdf4llm, providing a standardized interface for converting PDF documents to markdown format. This conversion is specifically optimized for consumption by Large Language Models.

The tool leverages the robust PDF parsing capabilities of PyMuPDF (formerly MuPDF) and enhances it with features specifically designed for LLM consumption:

1. **Complete Textual Content Extraction**: It preserves the semantic structure of documents, including headings, paragraphs, and lists.

2. **Accurate Image Placement**: Images are extracted and referenced in the markdown output, maintaining their relationship to the surrounding text.

3. **Standardized Output**: The consistent markdown format makes it easy for LLMs to process and understand the document structure.

4. **MCP Integration**: As an MCP server, it can be easily integrated with various LLM agent frameworks that support the Model Context Protocol.

By converting PDFs to markdown, pymupdf4llm-mcp transforms opaque binary documents into a format that LLMs can effectively process, understand, and reason about.

## Installation Guide

Getting started with pymupdf4llm-mcp is straightforward via [uv](https://github.com/astral-sh/uv), a fast Python package installer and resolver that makes dependency management seamless.

First, install uv if you don't have it already:

```bash
# Install uv using pip
pip install uv

# Or using the official installer script
curl -sSf https://astral.sh/uv/install.sh | bash
```

Then configure your MCP client (such as Cursor, Windsurf, or a custom agent) to use pymupdf4llm-mcp, add the following configuration:

```json
{
  "mcpServers": {
    "pymupdf4llm-mcp": {
      "command": "uvx",
      "args": [
        "pymupdf4llm-mcp@latest",
        "stdio"
      ],
      "env": {}
    }
  }
}
```

## Usage Examples

Now I'll show you how to use pymupdf4llm-mcp in a simple way: Building an [arxiv](https://arxiv.org/) summary agent via [pydantic-ai](https://github.com/pydantic/pydantic-ai). This example demonstrates how to integrate pymupdf4llm-mcp into an LLM agent workflow to automatically download and summarize academic papers.

```python
from typing import Annotated
from pydantic import Field
from pydantic_ai import Agent
from pydantic_ai.mcp import MCPServerStdio

import httpx

server = MCPServerStdio(
    "uvx",
    args=[
        "pymupdf4llm-mcp@latest",
        "stdio",
    ],
)
agent = Agent(
    "bedrock:us.anthropic.claude-3-7-sonnet-20250219-v1:0", mcp_servers=[server]
)


@agent.tool_plain
async def download_web(
    url: Annotated[str, Field(description="URL to download")],
    save_path: Annotated[
        str, Field(description="Absolute path where the file should be saved")
    ],
) -> dict[str, str]:
    """
    Download a file from a URL and save it to the specified path
    """

    try:
        response = httpx.get(url)
        response.raise_for_status()
        with open(save_path, "wb") as f:
            f.write(response.content)
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "message": f"Failed to download {url}",
        }
    else:
        return {
            "success": True,
            "message": f"Successfully downloaded {url} to {save_path}",
        }


async def main():
    async with agent.run_mcp_servers():
        result = await agent.run(
            "Please summarize the paper: https://arxiv.org/pdf/1706.03762"
        )
    print(result.output)


if __name__ == "__main__":
    import asyncio

    asyncio.run(main())
```

LLM Output:

```markdown
# Summary of "Attention Is All You Need" (arXiv:1706.03762)

This groundbreaking paper by Vaswani et al. introduces the **Transformer**, a novel neural network architecture for sequence transduction tasks like machine translation. Here's a comprehensive summary:

## Key Innovation
The Transformer represents a paradigm shift in neural machine translation by **completely eliminating recurrence and convolutions**, instead relying entirely on **attention mechanisms** to model relationships between input and output sequences.

## Core Architecture
1. **Encoder-Decoder Structure**:
   - **Encoder**: Stack of 6 identical layers, each containing a multi-head self-attention mechanism and a position-wise feed-forward network
   - **Decoder**: Stack of 6 identical layers with an additional cross-attention layer that attends to the encoder output

2. **Key Mechanisms**:
   - **Multi-Head Attention**: Allows the model to jointly attend to information from different representation subspaces
   - **Scaled Dot-Product Attention**: Computes attention weights between query-key pairs and applies them to values
   - **Positional Encoding**: Adds information about the position of tokens in the sequence using sine and cosine functions
   - **Residual connections and layer normalization**: Used throughout to facilitate training

## Advantages over RNN/CNN models
1. **Superior Parallelization**: Allows much more efficient training by computing all positions simultaneously
2. **Constant path length between positions**: Makes learning long-range dependencies easier (compared to linear/logarithmic path lengths in CNNs)
3. **Reduced training time**: Achieves state-of-the-art results with significantly less training time

## Performance Results
1. **English-to-German translation**: 28.4 BLEU score on WMT 2014, exceeding previous state-of-the-art by over 2 BLEU points
2. **English-to-French translation**: 41.8 BLEU score, establishing a new single-model state-of-the-art
3. **Training efficiency**: Achieved these results after just 3.5 days of training on eight GPUs, a fraction of the time required by previous models
4. **Generalization**: Successfully applied to English constituency parsing, demonstrating the model's versatility

## Impact
The Transformer architecture has become foundational in natural language processing, serving as the backbone for models like BERT, GPT, and other large language models that have revolutionized the field. Its self-attention mechanism allows for more effective modeling of long-range dependencies in sequences, making it particularly effective for language tasks.

The paper demonstrates that attention mechanisms alone are sufficient to build powerful sequence-to-sequence models, challenging the previous consensus that recurrent or convolutional architectures were necessary for these tasks.
```

### How the Example Works

1. **Setting up the MCP Server**: We initialize an MCP server that runs pymupdf4llm-mcp using the `stdio` transport method.

2. **Creating the Agent**: We create a Claude 3.7 Sonnet agent and connect it to our MCP server.

3. **Implementing a Download Tool**: We define a `download_web` tool that fetches PDF files from URLs.

4. **Behind the Scenes**: When the agent runs, it:
   - Downloads the PDF from arXiv using our custom tool
   - Uses pymupdf4llm-mcp to convert the PDF to markdown format
   - Processes the markdown content to understand the paper
   - Generates a comprehensive summary

This workflow enables LLM agents to work with PDF content almost as effectively as they work with plain text, opening up vast repositories of knowledge that were previously difficult to access programmatically.


## The Role of Context in LLM Agents

Current LLM agents have two key components: tools and context. While tools enable agents to interact with the world and perform actions, context is what informs their understanding and decision-making.

Context can come from two sources:
1. **User-provided information**: Direct input from users that frames the task or provides background.
2. **Observations**: Information gathered through tool use, such as web searches, file reading, or in this case, PDF parsing.

The quality of this context directly impacts the quality of the agent's outputs. When dealing with PDFs, poor parsing can lead to:
- Lost structural information (headings, sections, etc.)
- Missing or misplaced images
- Garbled text or formatting issues
- Loss of tables and other structured data

pymupdf4llm-mcp addresses these issues by providing high-quality, structured context from PDF documents. This enables LLMs to:
- Understand the document's organization and flow
- Reference specific sections or figures accurately
- Maintain the relationship between text and visual elements
- Process information in a way that preserves the author's intended meaning

As Claude 3.7 Sonnet and other advanced models demonstrate increasing proficiency at utilizing tools to gather context, the importance of high-quality context providers like pymupdf4llm-mcp becomes even more significant.

## Conclusion

By bridging the gap between the ubiquitous PDF format and the markdown format that LLMs can effectively process, pymupdf4llm-mcp removes a significant barrier to incorporating valuable document-based knowledge into AI agent workflows.

I hope to see more tools in the community that focus on providing high-quality context to LLMs, as this is a crucial foundation for building truly capable and helpful AI systems.
