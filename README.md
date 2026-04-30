# Secure Memory Isolation System

Welcome to the **Secure Memory Isolation System**, an interactive and educational web application designed to demonstrate the critical operating system concept of memory isolation. 

## 📝 Project Description

In modern operating systems, memory isolation is a fundamental security mechanism. It ensures that every process has its own private virtual address space. This project visualizes how the Memory Management Unit (MMU) handles memory access requests, demonstrating both legitimate memory accesses and unauthorized memory access attempts (segmentation faults). 

The system also includes an interactive AI Chatbot designed to answer questions and explain core OS concepts like Virtual Memory, Page Tables, ASLR, and the MMU.

## ✨ Features

- **Interactive Memory Visualization**: A visual representation of memory blocks allocated to different processes (Process A and Process B).
- **Legitimate Access Simulation**: Demonstrates a process successfully accessing its own allocated memory space.
- **Unauthorized Access Handling**: Simulates an attack where one process attempts to read/write to another process's memory. Visualizes the MMU blocking the access and triggering a Segmentation Fault (SIGSEGV).
- **Live Event Logging**: A real-time system log that outputs the actions taking place, including kernel warnings, access granted messages, and process termination alerts.
- **Educational AI Chatbot**: A built-in knowledge base chatbot ready to explain technical OS memory protection mechanisms.
- **Cyberpunk UI**: A highly responsive, modern, glassmorphism-based UI with interactive animations.

## 🚀 Getting Started

Simply open `index.html` in any modern web browser to run the simulation, or host it locally using a simple web server (e.g., `npx serve` or `python -m http.server`).

## 🛠️ Built With

- **HTML5**: Semantic structure.
- **CSS3**: Advanced styling, animations, and responsive layout.
- **Vanilla JavaScript**: Logic for memory access simulation, DOM manipulation, and the chatbot knowledge base.

---
*Created to explore and demonstrate core Operating System Security mechanisms.*
