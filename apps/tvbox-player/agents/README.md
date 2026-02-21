# TV Box Player Agent Instructions

This folder contains specialized agent instruction files for building the TV Box Player application. Each agent has a specific role and responsibilities in the development process.

## Overview

The TV Box Player application is developed using multiple specialized agents, each focusing on specific aspects of the project. This approach ensures expertise in each domain and efficient parallel development.

## Agent Structure

### Agent Files

1. **00_project_coordinator.md** - Project Coordinator and Technical Lead
   - Oversees entire project
   - Coordinates between agents
   - Makes architectural decisions
   - Manages quality gates and releases

2. **01_android_tv_app_developer.md** - Android TV Box Application Developer
   - Develops Kotlin-based Android TV application
   - Implements media player, caching, API server
   - Handles device pairing and content sync

3. **02_mobile_app_developer.md** - Mobile Application Developer (React Native)
   - Develops cross-platform mobile app (iOS/Android)
   - Implements remote control interface
   - Handles Google Drive integration
   - Creates playlist management UI

4. **03_testing_qa_specialist.md** - Testing and Quality Assurance Specialist
   - Creates comprehensive test suites
   - Performs security testing
   - Validates functionality and performance
   - Ensures quality standards

5. **04_build_deployment_specialist.md** - Build and Deployment Specialist
   - Sets up build pipelines
   - Creates release artifacts
   - Manages app store submissions
   - Handles CI/CD

6. **05_security_compliance_specialist.md** - Security and Compliance Specialist
   - Ensures security best practices
   - Validates data protection
   - Manages compliance (GDPR, CCPA)
   - Performs vulnerability assessments

## How to Use These Instructions

### For Project Management
1. Start with the Project Coordinator agent to understand overall project flow
2. Review each specialized agent's deliverables
3. Understand dependencies between agents
4. Track progress using the defined success criteria

### For Development
1. Each agent should read their respective instruction file completely
2. Review the "What You Should NOT Do" section carefully
3. Follow the priority order for implementation
4. Refer to specification documents in `/PRODUCT_SPECIFICATION.md` and `/setup/` folder
5. Coordinate with other agents as needed

### For Quality Assurance
1. Use testing agent instructions as the testing strategy
2. Validate all deliverables against success criteria
3. Report issues to the appropriate specialized agent
4. Ensure all quality gates are met before release

## Key Principles

### 1. Specialization
Each agent focuses on their area of expertise and should not overstep into other agents' responsibilities.

### 2. Collaboration
Agents must coordinate at integration points and share necessary information.

### 3. Quality First
No agent should compromise quality to meet deadlines. Follow the defined quality gates.

### 4. Security by Design
Security is non-negotiable. All agents must follow security guidelines.

### 5. MVP Focus
Stick to Phase 1 (MVP) features unless explicitly directed to implement Phase 2/3 features.

## Product Documentation References

All agents should be familiar with these core documents:

- **PRODUCT_SPECIFICATION.md** - Complete product requirements and features
- **setup/ARCHITECTURE.md** - System architecture and component design
- **setup/API_AND_DATA_STRUCTURES.md** - API endpoints and data models
- **setup/TECHNICAL_DETAILS.md** - Implementation details and dependencies

## Development Phases

### Phase 1: MVP (Current Focus)
All agents should focus on MVP features:
- Device pairing with 6-digit PIN code
- Google Drive integration only
- Simple playlist playback
- Basic remote control via mobile app
- Kotlin-based TV Box application
- React Native mobile application
- REST API communication with mDNS discovery

### Phase 2: Enhanced Features (Future)
Not to be implemented unless explicitly requested:
- QR code and Bluetooth pairing options
- Multiple cloud providers
- Advanced caching strategies
- Enhanced playback controls
- Subtitle and multi-audio track support
- WebSocket for real-time control

### Phase 3: Premium Features (Future)
Not to be implemented unless explicitly requested:
- Multi-device synchronization
- Voice control
- 4K playback optimization
- Advanced analytics

## Quality Gates

All deliverables must pass these quality gates:

### Development Quality Gates
- ✅ Code review approved
- ✅ Unit tests passing (> 80% coverage)
- ✅ No critical static analysis issues
- ✅ Security scan passing
- ✅ Documentation updated

### Integration Quality Gates
- ✅ Integration tests passing
- ✅ API contracts validated
- ✅ Cross-component testing complete
- ✅ Performance benchmarks met

### Release Quality Gates
- ✅ All features complete
- ✅ All tests passing (unit, integration, E2E)
- ✅ Code coverage > 80%
- ✅ No critical or high bugs
- ✅ Security audit passed
- ✅ Performance requirements met
- ✅ Documentation complete
- ✅ QA approval obtained

## Success Criteria

### Overall Project Success
- ✅ All MVP features delivered and working
- ✅ All platforms functional (Android TV, iOS, Android)
- ✅ Quality gates met
- ✅ Performance requirements met
- ✅ Security requirements met
- ✅ Documentation complete
- ✅ Released and available to users

## Communication and Coordination

### Agent Handoffs
Clear handoff points between agents:
1. **Android TV Developer → Testing QA**: Feature implementation complete
2. **Mobile Developer → Testing QA**: Feature implementation complete
3. **Testing QA → Build/Deployment**: Tests passing, ready for build
4. **Build/Deployment → Security**: Release artifacts ready for security review
5. **Security → Project Coordinator**: Security approval for release
6. **Project Coordinator**: Final release approval

### Issue Resolution
1. Agent identifies issue
2. Reports to Project Coordinator
3. Coordinator assigns to appropriate agent
4. Agent resolves and validates
5. Coordinator verifies resolution

## Technical Stack Summary

### Android TV Box Application
- **Language**: Kotlin
- **Media Player**: ExoPlayer (androidx.media3)
- **HTTP Server**: Ktor or NanoHTTPD
- **Database**: Room (SQLite)
- **Network**: OkHttp, Retrofit
- **mDNS**: JmDNS
- **Image Loading**: Coil or Glide
- **JWT**: jjwt library

### Mobile Application
- **Framework**: React Native
- **State Management**: Redux + Redux-Saga
- **Navigation**: React Navigation
- **HTTP Client**: Axios
- **Cloud SDK**: react-native-google-drive-api-wrapper
- **mDNS**: react-native-zeroconf
- **Storage**: AsyncStorage or react-native-mmkv

### Security
- **Encryption**: AES-256-GCM
- **TLS**: Version 1.3
- **Authentication**: OAuth 2.0, JWT
- **Secure Storage**: Android Keystore, iOS Keychain

## Performance Requirements

All agents must ensure these requirements are met:
- **Pairing**: Complete within 10 seconds
- **Playback start** (cached content): Within 2 seconds
- **Remote command latency**: < 500ms
- **App size**: < 50MB (Android TV)
- **4K@30fps**: Supported
- **Crash-free rate**: > 99.5%
- **ANR rate**: < 0.1%

## Questions or Clarifications

If any agent needs clarification on specifications or encounters ambiguity:
1. Check the specification documents first
2. Consult with the Project Coordinator
3. Document the decision made
4. Update relevant documentation

## Version History

- **Version 1.0** (2026-02-18): Initial agent instructions created
  - Defined all specialized agent roles
  - Established coordination protocols
  - Documented quality gates and success criteria
  - Aligned with product specification and architecture documents

---

**Last Updated**: 2026-02-18  
**Document Version**: 1.0  
**Status**: Active
