# Exa API Documentation Context

# Quickstart

> Make your first request to one of Exa's API endpoints

***

## Create and setup your API key

<Card title="Get your Exa API key" icon="key" horizontal href="https://dashboard.exa.ai/api-keys" />

<br />

## Create a .env file

Create a file called `.env` in the root of your project and add the following line.

```bash  theme={null}
EXA_API_KEY=your api key without quotes
```

<br />

{" "}

## Make an API request

Use our python or javascript SDKs, or call the API directly with cURL.

<Tabs>
  <Tab title="Python">
    Install the python SDKs with pip.  If you want to store your API key in a `.env` file, make sure to install the dotenv library.

    ```bash  theme={null}
    pip install exa-py
    pip install openai
    pip install python-dotenv
    ```

    Once you've installed the SDKs, create a file called `exa.py` and add the code below.

    <Tabs>
      <Tab title="Search and crawl">
        Get a list of results and their full text content.

        ```python python theme={null}
        from exa_py import Exa
        from dotenv import load_dotenv

        import os

        # Use .env to store your API key or paste it directly into the code
        load_dotenv()
        exa = Exa(os.getenv('EXA_API_KEY'))

        result = exa.search_and_contents(
          "An article about the state of AGI",
          type="auto",
          text=True,
        )

        print(result)
        ```
      </Tab>

      <Tab title="Answer">
        Get an answer to a question, grounded by citations from exa.

        ```python python theme={null}
        from exa_py import Exa
        from dotenv import load_dotenv

        import os

        # Use .env to store your API key or paste it directly into the code
        load_dotenv()
        exa = Exa(os.getenv('EXA_API_KEY'))

        result = exa.stream_answer(
          "What are the latest findings on gut microbiome's influence on mental health?",
          text=True,
        )

        for chunk in result:
          print(chunk, end='', flush=True)
        ```
      </Tab>

      <Tab title="Chat Completions">
        Get a chat completion from exa.

        ```python python theme={null}
        from openai import OpenAI
        from dotenv import load_dotenv

        import os

        # Use .env to store your API key or paste it directly into the code
        load_dotenv()

        client = OpenAI(
          base_url="https://api.exa.ai",
          api_key=os.getenv('EXA_API_KEY'),
        )

        completion = client.chat.completions.create(
          model="exa",
          messages = [
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": "What are the latest developments in quantum computing?"}
        ],

          extra_body={
            "text": True
          }
        )
        print(completion.choices[0].message.content)
        ```
      </Tab>

      <Tab title="Find similar links and get full text">
        Find similar links to a given URL and get the full text for each link.

        ```python python theme={null}
        from exa_py import Exa
        from dotenv import load_dotenv

        import os

        load_dotenv()

        exa = Exa(os.getenv('EXA_API_KEY'))

        # get similar links to this post about AGI
        result = exa.find_similar(
          "https://amistrongeryet.substack.com/p/are-we-on-the-brink-of-agi",
          exclude_domains = ["amistrongeryet.substack.com"],
          num_results = 3
        )
        urls = [link_data.url for link_data in result.results]

        # get full text for each url
        web_pages = exa.get_contents(
          urls,
          text=True
        )

        for web_page in web_pages.results:
          print(f"URL: {web_page.url}")
          print(f"Text snippet: {web_page.text[:500]} ...")
          print("-"*100)
        ```
      </Tab>
    </Tabs>
  </Tab>

  <Tab title="JavaScript">
    Install the javascript SDK with npm. If you want to store your API key in a `.env` file, make sure to install the dotenv library.

    ```bash  theme={null}
    npm install exa-js
    npm install openai
    npm install dotenv
    ```

    Once you've installed the SDK, create a file called `exa.ts` and add the code below.

    <Tabs>
      <Tab title="Search and crawl">
        Get a list of results and their full text content.

        ```javascript javascript theme={null}
        import dotenv from 'dotenv';
        import Exa from 'exa-js';

        dotenv.config();

        const exa = new Exa(process.env.EXA_API_KEY);

        const result = await exa.searchAndContents(
          "An article about the state of AGI",
          {
            type: "auto",
            text: true
          }
        );

        // print the first result
        console.log(result.results[0]);
        ```
      </Tab>

      <Tab title="Answer">
        Get an answer to a question, grounded by citations from exa.

        ```javascript javascript theme={null}
        import dotenv from 'dotenv';
        import Exa from 'exa-js';

        dotenv.config();

        const exa = new Exa(process.env.EXA_API_KEY);
        for await (const chunk of exa.streamAnswer(
          "What is the population of New York City?",
          {
            text: true
          }
        )) {
          if (chunk.content) {
            process.stdout.write(chunk.content);
          }
          if (chunk.citations) {
            console.log("\nCitations:", chunk.citations);
          }
        }
        ```
      </Tab>

      <Tab title="Chat Completions">
        Get a chat completion from exa.

        ```javascript javascript theme={null}
        import OpenAI from "openai";
        import dotenv from 'dotenv';
        import Exa from 'exa-js';

        dotenv.config();

        const openai = new OpenAI({
          baseURL: "https://api.exa.ai",
          apiKey: process.env.EXA_API_KEY,
        });

        async function main() {
        const completion = await openai.chat.completions.create({
          model: "exa",
          messages: [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "What are the latest developments in quantum computing?"}
          ],
          store: true,
          stream: true,
          extra_body: {
            text: true // include full text from sources
          }
        });

        for await (const chunk of completion) {
          console.log(chunk.choices[0].delta.content);
          }
        }

        main();
        ```
      </Tab>

      <Tab title="Find similar links and get full text">
        Find similar links to a given URL and get the full text for each link.

        ```javascript javascript theme={null}
        import Exa from 'exa-js';
        import dotenv from 'dotenv';

        dotenv.config();

        const exa = new Exa(process.env.EXA_API_KEY);

        // Find similar links to this post about AGI
        const result = await exa.findSimilar(
          "https://amistrongeryet.substack.com/p/are-we-on-the-brink-of-agi",
          {
            excludeDomains: ["amistrongeryet.substack.com"],
            numResults: 3
          }
        );

        const urls = result.results.map(linkData => linkData.url);

        // Get full text for each URL
        const webPages = await exa.getContents(urls, { text: true });

        webPages.results.forEach(webPage => {
          console.log(`URL: ${webPage.url}`);
          console.log(`Text snippet: ${webPage.text.slice(0, 500)} ...`);
          console.log("-".repeat(100));
        });
        ```
      </Tab>
    </Tabs>
  </Tab>

  <Tab title="cURL">
    Pass one of the following commands to your terminal to make an API request.

    <Tabs>
      <Tab title="Search and crawl">
        Get a list of results and their full text content.

        ```bash bash theme={null}
        curl --request POST \
            --url https://api.exa.ai/search \
            --header 'accept: application/json' \
            --header 'content-type: application/json' \
            --header "x-api-key: ${EXA_API_KEY}" \
            --data '
        {
            "query": "An article about the state of AGI",
            "type": "auto",
            "contents": {
              "text": true
            }
        }'
        ```
      </Tab>

      <Tab title="Answer">
        Get an answer to a question, grounded by citations from exa.

        ```bash bash theme={null}
        curl --request POST \
          --url https://api.exa.ai/answer \
          --header 'accept: application/json' \
          --header 'content-type: application/json' \
          --header "x-api-key: ${EXA_API_KEY}" \
          --data "{
            \"query\": \"What are the latest findings on gut microbiome's influence on mental health?\",
            \"text\": true
          }"
        ```
      </Tab>

      <Tab title="Chat Completions">
        Get a chat completion from exa.

        ```bash bash theme={null}
        curl https://api.exa.ai/chat/completions \
          -H "Content-Type: application/json" \
          -H "x-api-key: ${EXA_API_KEY}" \
          -d '{
            "model": "exa", 
            "messages": [
              {
                "role": "system",
                "content": "You are a helpful assistant."
              },
              {
                "role": "user",
                "content": "What are the latest developments in quantum computing?"
              }
            ],
            "extra_body": {
              "text": true
            }
          }'
        ```
      </Tab>
    </Tabs>
  </Tab>
</Tabs>


# Search

> The search endpoint lets you intelligently search the web and extract contents from the results. 

By default, it automatically chooses between traditional keyword search and Exa's embeddings-based model, to find the most relevant results for your query.

## OpenAPI

````yaml post /search
paths:
  path: /search
  method: post
  servers:
    - url: https://api.exa.ai
  request:
    security:
      - title: apikey
        parameters:
          query: {}
          header:
            x-api-key:
              type: apiKey
              description: >-
                API key can be provided either via x-api-key header or
                Authorization header with Bearer scheme
          cookie: {}
    parameters:
      path: {}
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              query:
                allOf:
                  - type: string
                    example: Latest developments in LLM capabilities
                    default: Latest developments in LLM capabilities
                    description: The query string for the search.
              type:
                allOf:
                  - type: string
                    enum:
                      - keyword
                      - neural
                      - fast
                      - auto
                    description: >-
                      The type of search. Neural uses an embeddings-based model,
                      keyword is google-like SERP, and auto (default)
                      intelligently combines the two. Fast uses streamlined
                      versions of the neural and keyword models.
                    example: auto
                    default: auto
              category:
                allOf:
                  - type: string
                    enum:
                      - company
                      - research paper
                      - news
                      - pdf
                      - github
                      - tweet
                      - personal site
                      - linkedin profile
                      - financial report
                    description: A data category to focus on.
                    example: research paper
              userLocation:
                allOf:
                  - type: string
                    description: The two-letter ISO country code of the user, e.g. US.
                    example: US
              numResults:
                allOf:
                  - type: integer
                    maximum: 100
                    default: 10
                    description: >
                      Number of results to return. Limits vary by search type:

                      - With "keyword": max 10 results

                      - With "neural": max 100 results


                      If you want to increase the num results beyond these
                      limits, contact sales (hello@exa.ai)
                    example: 10
              includeDomains:
                allOf:
                  - type: array
                    items:
                      type: string
                    description: >-
                      List of domains to include in the search. If specified,
                      results will only come from these domains.
                    example:
                      - arxiv.org
                      - paperswithcode.com
              excludeDomains:
                allOf:
                  - type: array
                    items:
                      type: string
                    description: >-
                      List of domains to exclude from search results. If
                      specified, no results will be returned from these domains.
              startCrawlDate:
                allOf:
                  - type: string
                    format: date-time
                    description: >-
                      Crawl date refers to the date that Exa discovered a link.
                      Results will include links that were crawled after this
                      date. Must be specified in ISO 8601 format.
                    example: '2023-01-01T00:00:00.000Z'
              endCrawlDate:
                allOf:
                  - type: string
                    format: date-time
                    description: >-
                      Crawl date refers to the date that Exa discovered a link.
                      Results will include links that were crawled before this
                      date. Must be specified in ISO 8601 format.
                    example: '2023-12-31T00:00:00.000Z'
              startPublishedDate:
                allOf:
                  - type: string
                    format: date-time
                    description: >-
                      Only links with a published date after this will be
                      returned. Must be specified in ISO 8601 format.
                    example: '2023-01-01T00:00:00.000Z'
              endPublishedDate:
                allOf:
                  - type: string
                    format: date-time
                    description: >-
                      Only links with a published date before this will be
                      returned. Must be specified in ISO 8601 format.
                    example: '2023-12-31T00:00:00.000Z'
              includeText:
                allOf:
                  - type: array
                    items:
                      type: string
                    description: >-
                      List of strings that must be present in webpage text of
                      results. Currently, only 1 string is supported, of up to 5
                      words.
                    example:
                      - large language model
              excludeText:
                allOf:
                  - type: array
                    items:
                      type: string
                    description: >-
                      List of strings that must not be present in webpage text
                      of results. Currently, only 1 string is supported, of up
                      to 5 words. Checks from the first 1000 words of the
                      webpage text.
                    example:
                      - course
              context:
                allOf:
                  - oneOf:
                      - type: boolean
                        description: >-
                          Return page contents as a context string for LLM. When
                          true, combines all result contents into one string. We
                          recommend using 10000+ characters for best results,
                          though no limit works best. Context strings often
                          perform better than highlights for RAG applications.
                        example: true
                      - type: object
                        description: >-
                          Return page contents as a context string for LLM. When
                          true, combines all result contents into one string. We
                          recommend using 10000+ characters for best results,
                          though no limit works best. Context strings often
                          perform better than highlights for RAG applications.
                        properties:
                          maxCharacters:
                            type: integer
                            description: >-
                              Maximum character limit for the context string. If
                              you have 5 results and set 1000 characters, each
                              result gets about 200 characters. We recommend
                              10000+ characters for best performance.
                            example: 10000
              moderation:
                allOf:
                  - type: boolean
                    default: false
                    description: >-
                      Enable content moderation to filter unsafe content from
                      search results.
                    example: true
              contents:
                allOf:
                  - $ref: '#/components/schemas/ContentsRequest'
            required: true
            refIdentifier: '#/components/schemas/CommonRequest'
            requiredProperties:
              - query
        examples:
          example:
            value:
              query: Latest developments in LLM capabilities
              type: auto
              category: research paper
              userLocation: US
              numResults: 10
              includeDomains:
                - arxiv.org
                - paperswithcode.com
              excludeDomains:
                - <string>
              startCrawlDate: '2023-01-01T00:00:00.000Z'
              endCrawlDate: '2023-12-31T00:00:00.000Z'
              startPublishedDate: '2023-01-01T00:00:00.000Z'
              endPublishedDate: '2023-12-31T00:00:00.000Z'
              includeText:
                - large language model
              excludeText:
                - course
              context: true
              moderation: true
              contents:
                text: true
                highlights:
                  numSentences: 1
                  highlightsPerUrl: 1
                  query: Key advancements
                summary:
                  query: Main developments
                  schema:
                    $schema: http://json-schema.org/draft-07/schema#
                    title: Title
                    type: object
                    properties:
                      Property 1:
                        type: string
                        description: Description
                      Property 2:
                        type: string
                        enum:
                          - option 1
                          - option 2
                          - option 3
                        description: Description
                    required:
                      - Property 1
                livecrawl: always
                livecrawlTimeout: 1000
                subpages: 1
                subpageTarget: sources
                extras:
                  links: 1
                  imageLinks: 1
                context: true
    codeSamples:
      - label: Simple search and contents
        lang: bash
        source: |
          curl -X POST 'https://api.exa.ai/search' \
            -H 'x-api-key: YOUR-EXA-API-KEY' \
            -H 'Content-Type: application/json' \
            -d '{
              "query": "Latest research in LLMs",
              "text": true
            }'
      - label: Simple search and contents
        lang: python
        source: |
          # pip install exa-py
          from exa_py import Exa
          exa = Exa('YOUR_EXA_API_KEY')

          results = exa.search_and_contents(
              "Latest research in LLMs", 
              text=True
          )

          print(results)
      - label: Simple search and contents
        lang: javascript
        source: |
          // npm install exa-js
          import Exa from 'exa-js';
          const exa = new Exa('YOUR_EXA_API_KEY');

          const results = await exa.searchAndContents(
              'Latest research in LLMs', 
              { text: true }
          );

          console.log(results);
      - label: Simple search and contents
        lang: php
        source: ''
      - label: Simple search and contents
        lang: go
        source: ''
      - label: Simple search and contents
        lang: java
        source: ''
      - label: Advanced search with filters
        lang: bash
        source: |
          curl --request POST \
            --url https://api.exa.ai/search \
            --header 'x-api-key: <token>' \
            --header 'Content-Type: application/json' \
            --data '{
            "query": "Latest research in LLMs",
            "type": "auto",
            "category": "research paper",
            "numResults": 10,
            "moderation": true,
            "contents": {
              "text": true,
              "summary": {
                "query": "Main developments"
              },
              "subpages": 1,
              "subpageTarget": "sources",
              "extras": {
                "links": 1,
                "imageLinks": 1
              }
            }
          }'
      - label: Advanced search with filters
        lang: python
        source: |
          # pip install exa-py
          from exa_py import Exa
          exa = Exa('YOUR_EXA_API_KEY')

          results = exa.search_and_contents(
              "Latest research in LLMs",
              type="auto",
              category="research paper",
              num_results=10,
              moderation=True,
              text=True,
              summary={
                  "query": "Main developments"
              },
              subpages=1,
              subpage_target="sources",
              extras={
                  "links": 1,
                  "image_links": 1
              }
          )

          print(results)
      - label: Advanced search with filters
        lang: javascript
        source: >
          // npm install exa-js

          import Exa from 'exa-js';

          const exa = new Exa('YOUR_EXA_API_KEY');


          const results = await exa.searchAndContents('Latest research in LLMs',
          {
              type: 'auto',
              category: 'research paper',
              numResults: 10,
              moderation: true,
              contents: {
                  text: true,
                  summary: {
                      query: 'Main developments'
                  },
                  subpages: 1,
                  subpageTarget: 'sources',
                  extras: {
                      links: 1,
                      imageLinks: 1
                  }
              }
          });


          console.log(results);
      - label: Advanced search with filters
        lang: php
        source: ''
      - label: Advanced search with filters
        lang: go
        source: ''
      - label: Advanced search with filters
        lang: java
        source: ''
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              requestId:
                allOf:
                  - type: string
                    description: Unique identifier for the request
                    example: b5947044c4b78efa9552a7c89b306d95
              resolvedSearchType:
                allOf:
                  - type: string
                    enum:
                      - neural
                      - keyword
                    description: The search type that was actually used for this request
                    example: neural
              results:
                allOf:
                  - type: array
                    description: >-
                      A list of search results containing title, URL, published
                      date, and author.
                    items:
                      $ref: '#/components/schemas/ResultWithContent'
              searchType:
                allOf:
                  - type: string
                    enum:
                      - neural
                      - keyword
                    description: >-
                      For auto searches, indicates which search type was
                      selected.
                    example: auto
              context:
                allOf:
                  - type: string
                    description: >-
                      Return page contents as a context string for LLM. When
                      true, combines all result contents into one string.
                      Context strings often perform better than highlights for
                      LLMs.
              costDollars:
                allOf:
                  - $ref: '#/components/schemas/CostDollars'
        examples:
          example:
            value:
              requestId: b5947044c4b78efa9552a7c89b306d95
              resolvedSearchType: neural
              results:
                - title: A Comprehensive Overview of Large Language Models
                  url: https://arxiv.org/pdf/2307.06435.pdf
                  publishedDate: '2023-11-16T01:36:32.547Z'
                  author: >-
                    Humza  Naveed, University of Engineering and Technology
                    (UET), Lahore, Pakistan
                  id: https://arxiv.org/abs/2307.06435
                  image: https://arxiv.org/pdf/2307.06435.pdf/page_1.png
                  favicon: https://arxiv.org/favicon.ico
                  text: >-
                    Abstract Large Language Models (LLMs) have recently
                    demonstrated remarkable capabilities...
                  highlights:
                    - Such requirements have limited their adoption...
                  highlightScores:
                    - 0.4600165784358978
                  summary: >-
                    This overview paper on Large Language Models (LLMs)
                    highlights key developments...
                  subpages:
                    - id: https://arxiv.org/abs/2303.17580
                      url: https://arxiv.org/pdf/2303.17580.pdf
                      title: >-
                        HuggingGPT: Solving AI Tasks with ChatGPT and its
                        Friends in Hugging Face
                      author: >-
                        Yongliang  Shen, Microsoft Research Asia, Kaitao  Song,
                        Microsoft Research Asia, Xu  Tan, Microsoft Research
                        Asia, Dongsheng  Li, Microsoft Research Asia, Weiming 
                        Lu, Microsoft Research Asia, Yueting  Zhuang, Microsoft
                        Research Asia, yzhuang@zju.edu.cn, Zhejiang  University,
                        Microsoft Research Asia, Microsoft  Research, Microsoft
                        Research Asia
                      publishedDate: '2023-11-16T01:36:20.486Z'
                      text: >-
                        HuggingGPT: Solving AI Tasks with ChatGPT and its
                        Friends in Hugging Face Date Published: 2023-05-25
                        Authors: Yongliang Shen, Microsoft Research Asia Kaitao
                        Song, Microsoft Research Asia Xu Tan, Microsoft Research
                        Asia Dongsheng Li, Microsoft Research Asia Weiming Lu,
                        Microsoft Research Asia Yueting Zhuang, Microsoft
                        Research Asia, yzhuang@zju.edu.cn Zhejiang University,
                        Microsoft Research Asia Microsoft Research, Microsoft
                        Research Asia Abstract Solving complicated AI tasks with
                        different domains and modalities is a key step toward
                        artificial general intelligence. While there are
                        abundant AI models available for different domains and
                        modalities, they cannot handle complicated AI tasks.
                        Considering large language models (LLMs) have exhibited
                        exceptional ability in language understanding,
                        generation, interaction, and reasoning, we advocate that
                        LLMs could act as a controller to manage existing AI
                        models to solve complicated AI tasks and language could
                        be a generic interface to empower t
                      summary: >-
                        HuggingGPT is a framework using ChatGPT as a central
                        controller to orchestrate various AI models from Hugging
                        Face to solve complex tasks. ChatGPT plans the task,
                        selects appropriate models based on their descriptions,
                        executes subtasks, and summarizes the results. This
                        approach addresses limitations of LLMs by allowing them
                        to handle multimodal data (vision, speech) and
                        coordinate multiple models for complex tasks, paving the
                        way for more advanced AI systems.
                      highlights:
                        - >-
                          2) Recently, some researchers started to investigate
                          the integration of using tools or models in LLMs  .
                      highlightScores:
                        - 0.32679107785224915
                  extras:
                    links: []
              searchType: auto
              context: <string>
              costDollars:
                total: 0.005
                breakDown:
                  - search: 0.005
                    contents: 0
                    breakdown:
                      keywordSearch: 0
                      neuralSearch: 0.005
                      contentText: 0
                      contentHighlight: 0
                      contentSummary: 0
                perRequestPrices:
                  neuralSearch_1_25_results: 0.005
                  neuralSearch_26_100_results: 0.025
                  neuralSearch_100_plus_results: 1
                  keywordSearch_1_100_results: 0.0025
                  keywordSearch_100_plus_results: 3
                perPagePrices:
                  contentText: 0.001
                  contentHighlight: 0.001
                  contentSummary: 0.001
        description: OK
  deprecated: false
  type: path
components:
  schemas:
    ContentsRequest:
      type: object
      properties:
        text:
          oneOf:
            - type: boolean
              title: Simple text retrieval
              description: >-
                If true, returns full page text with default settings. If false,
                disables text return.
            - type: object
              title: Advanced text options
              description: >-
                Advanced options for controlling text extraction. Use this when
                you need to limit text length or include HTML structure.
              properties:
                maxCharacters:
                  type: integer
                  description: >-
                    Maximum character limit for the full page text. Useful for
                    controlling response size and API costs.
                  example: 1000
                includeHtmlTags:
                  type: boolean
                  default: false
                  description: >-
                    Include HTML tags in the response, which can help LLMs
                    understand text structure and formatting.
                  example: false
        highlights:
          type: object
          description: Text snippets the LLM identifies as most relevant from each page.
          properties:
            numSentences:
              type: integer
              minimum: 1
              description: The number of sentences to return for each snippet.
              example: 1
            highlightsPerUrl:
              type: integer
              minimum: 1
              description: The number of snippets to return for each result.
              example: 1
            query:
              type: string
              description: Custom query to direct the LLM's selection of highlights.
              example: Key advancements
        summary:
          type: object
          description: Summary of the webpage
          properties:
            query:
              type: string
              description: Custom query for the LLM-generated summary.
              example: Main developments
            schema:
              type: object
              description: >
                JSON schema for structured output from summary. 

                See https://json-schema.org/overview/what-is-jsonschema for JSON
                Schema documentation.
              example:
                $schema: http://json-schema.org/draft-07/schema#
                title: Title
                type: object
                properties:
                  Property 1:
                    type: string
                    description: Description
                  Property 2:
                    type: string
                    enum:
                      - option 1
                      - option 2
                      - option 3
                    description: Description
                required:
                  - Property 1
        livecrawl:
          type: string
          enum:
            - never
            - fallback
            - always
            - preferred
          description: >
            Options for livecrawling pages.

            'never': Disable livecrawling (default for neural search).

            'fallback': Livecrawl when cache is empty (default for keyword
            search).

            'always': Always livecrawl.

            'preferred': Always try to livecrawl, but fall back to cache if
            crawling fails.
          example: always
        livecrawlTimeout:
          type: integer
          default: 10000
          description: The timeout for livecrawling in milliseconds.
          example: 1000
        subpages:
          type: integer
          default: 0
          description: >-
            The number of subpages to crawl. The actual number crawled may be
            limited by system constraints.
          example: 1
        subpageTarget:
          oneOf:
            - type: string
            - type: array
              items:
                type: string
          description: >-
            Keyword to find specific subpages of search results. Can be a single
            string or an array of strings, comma delimited.
          example: sources
        extras:
          type: object
          description: Extra parameters to pass.
          properties:
            links:
              type: integer
              default: 0
              description: Number of URLs to return from each webpage.
              example: 1
            imageLinks:
              type: integer
              default: 0
              description: Number of images to return for each result.
              example: 1
        context:
          oneOf:
            - type: boolean
              description: >-
                Return page contents as a context string for LLM. When true,
                combines all result contents into one string. We recommend using
                10000+ characters for best results, though no limit works best.
                Context strings often perform better than highlights for RAG
                applications.
              example: true
            - type: object
              description: >-
                Return page contents as a context string for LLM. When true,
                combines all result contents into one string. We recommend using
                10000+ characters for best results, though no limit works best.
                Context strings often perform better than highlights for RAG
                applications.
              properties:
                maxCharacters:
                  type: integer
                  description: >-
                    Maximum character limit for the context string. If you have
                    5 results and set 1000 characters, each result gets about
                    200 characters. We recommend 10000+ characters for best
                    performance.
                  example: 10000
    Result:
      type: object
      properties:
        title:
          type: string
          description: The title of the search result.
          example: A Comprehensive Overview of Large Language Models
        url:
          type: string
          format: uri
          description: The URL of the search result.
          example: https://arxiv.org/pdf/2307.06435.pdf
        publishedDate:
          type: string
          nullable: true
          description: >-
            An estimate of the creation date, from parsing HTML content. Format
            is YYYY-MM-DD.
          example: '2023-11-16T01:36:32.547Z'
        author:
          type: string
          nullable: true
          description: If available, the author of the content.
          example: >-
            Humza  Naveed, University of Engineering and Technology (UET),
            Lahore, Pakistan
        id:
          type: string
          description: The temporary ID for the document. Useful for /contents endpoint.
          example: https://arxiv.org/abs/2307.06435
        image:
          type: string
          format: uri
          description: The URL of an image associated with the search result, if available.
          example: https://arxiv.org/pdf/2307.06435.pdf/page_1.png
        favicon:
          type: string
          format: uri
          description: The URL of the favicon for the search result's domain.
          example: https://arxiv.org/favicon.ico
    ResultWithContent:
      allOf:
        - $ref: '#/components/schemas/Result'
        - type: object
          properties:
            text:
              type: string
              description: The full content text of the search result.
              example: >-
                Abstract Large Language Models (LLMs) have recently demonstrated
                remarkable capabilities...
            highlights:
              type: array
              items:
                type: string
              description: Array of highlights extracted from the search result content.
              example:
                - Such requirements have limited their adoption...
            highlightScores:
              type: array
              items:
                type: number
                format: float
              description: Array of cosine similarity scores for each highlighted
              example:
                - 0.4600165784358978
            summary:
              type: string
              description: Summary of the webpage
              example: >-
                This overview paper on Large Language Models (LLMs) highlights
                key developments...
            subpages:
              type: array
              items:
                $ref: '#/components/schemas/ResultWithContent'
              description: Array of subpages for the search result.
              example:
                - id: https://arxiv.org/abs/2303.17580
                  url: https://arxiv.org/pdf/2303.17580.pdf
                  title: >-
                    HuggingGPT: Solving AI Tasks with ChatGPT and its Friends in
                    Hugging Face
                  author: >-
                    Yongliang  Shen, Microsoft Research Asia, Kaitao  Song,
                    Microsoft Research Asia, Xu  Tan, Microsoft Research Asia,
                    Dongsheng  Li, Microsoft Research Asia, Weiming  Lu,
                    Microsoft Research Asia, Yueting  Zhuang, Microsoft Research
                    Asia, yzhuang@zju.edu.cn, Zhejiang  University, Microsoft
                    Research Asia, Microsoft  Research, Microsoft Research Asia
                  publishedDate: '2023-11-16T01:36:20.486Z'
                  text: >-
                    HuggingGPT: Solving AI Tasks with ChatGPT and its Friends in
                    Hugging Face Date Published: 2023-05-25 Authors: Yongliang
                    Shen, Microsoft Research Asia Kaitao Song, Microsoft
                    Research Asia Xu Tan, Microsoft Research Asia Dongsheng Li,
                    Microsoft Research Asia Weiming Lu, Microsoft Research Asia
                    Yueting Zhuang, Microsoft Research Asia, yzhuang@zju.edu.cn
                    Zhejiang University, Microsoft Research Asia Microsoft
                    Research, Microsoft Research Asia Abstract Solving
                    complicated AI tasks with different domains and modalities
                    is a key step toward artificial general intelligence. While
                    there are abundant AI models available for different domains
                    and modalities, they cannot handle complicated AI tasks.
                    Considering large language models (LLMs) have exhibited
                    exceptional ability in language understanding, generation,
                    interaction, and reasoning, we advocate that LLMs could act
                    as a controller to manage existing AI models to solve
                    complicated AI tasks and language could be a generic
                    interface to empower t
                  summary: >-
                    HuggingGPT is a framework using ChatGPT as a central
                    controller to orchestrate various AI models from Hugging
                    Face to solve complex tasks. ChatGPT plans the task, selects
                    appropriate models based on their descriptions, executes
                    subtasks, and summarizes the results. This approach
                    addresses limitations of LLMs by allowing them to handle
                    multimodal data (vision, speech) and coordinate multiple
                    models for complex tasks, paving the way for more advanced
                    AI systems.
                  highlights:
                    - >-
                      2) Recently, some researchers started to investigate the
                      integration of using tools or models in LLMs  .
                  highlightScores:
                    - 0.32679107785224915
            extras:
              type: object
              description: Results from extras.
              properties:
                links:
                  type: array
                  items:
                    type: string
                  description: Array of links from the search result.
                  example: []
    CostDollars:
      type: object
      properties:
        total:
          type: number
          format: float
          description: Total dollar cost for your request
          example: 0.005
        breakDown:
          type: array
          description: Breakdown of costs by operation type
          items:
            type: object
            properties:
              search:
                type: number
                format: float
                description: Cost of your search operations
                example: 0.005
              contents:
                type: number
                format: float
                description: Cost of your content operations
                example: 0
              breakdown:
                type: object
                properties:
                  keywordSearch:
                    type: number
                    format: float
                    description: Cost of your keyword search operations
                    example: 0
                  neuralSearch:
                    type: number
                    format: float
                    description: Cost of your neural search operations
                    example: 0.005
                  contentText:
                    type: number
                    format: float
                    description: Cost of your text content retrieval
                    example: 0
                  contentHighlight:
                    type: number
                    format: float
                    description: Cost of your highlight generation
                    example: 0
                  contentSummary:
                    type: number
                    format: float
                    description: Cost of your summary generation
                    example: 0
        perRequestPrices:
          type: object
          description: Standard price per request for different operations
          properties:
            neuralSearch_1_25_results:
              type: number
              format: float
              description: Standard price for neural search with 1-25 results
              example: 0.005
            neuralSearch_26_100_results:
              type: number
              format: float
              description: Standard price for neural search with 26-100 results
              example: 0.025
            neuralSearch_100_plus_results:
              type: number
              format: float
              description: Standard price for neural search with 100+ results
              example: 1
            keywordSearch_1_100_results:
              type: number
              format: float
              description: Standard price for keyword search with 1-100 results
              example: 0.0025
            keywordSearch_100_plus_results:
              type: number
              format: float
              description: Standard price for keyword search with 100+ results
              example: 3
        perPagePrices:
          type: object
          description: Standard price per page for different content operations
          properties:
            contentText:
              type: number
              format: float
              description: Standard price per page for text content
              example: 0.001
            contentHighlight:
              type: number
              format: float
              description: Standard price per page for highlights
              example: 0.001
            contentSummary:
              type: number
              format: float
              description: Standard price per page for summaries
              example: 0.001

````